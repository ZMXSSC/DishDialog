import {RequestHandler} from "express";
import RecipeModel from "../models/recipe"
import createHttpError from "http-errors";
import mongoose from "mongoose";
import assertIsDefined from "../util/assertIsDefined";
import multer from 'multer';
import {GridFsStorage} from 'multer-gridfs-storage';
import crypto from "crypto";
import path from "path"
import env from "../util/validateEnv"
import {Request} from "express";
import {Response, NextFunction} from 'express';
import {GridFSBucket} from 'mongodb';
import {getDbConnection} from '../server';

//To create endpoints, the best practice is to define the callback functions first in recipescontroller.ts
//With the callback function, we can export it and use HTTP verb(GET, POST...) in recipes.ts with path that acts as router
//At last, in app.ts we use app.use() to utilize the router

//This would call a modular structure


//Since we are using multer, we need to extend the Request interface to include the file property(we will apply
//this interface for both createRecipe and updateRecipe)
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

//we create a multer storage engine that will store the image in MongoDB
//The image will be stored in the "uploads" collection
const storage = new GridFsStorage({
    url: env.MONGO_CONNECTION_STRING, // Replace with your MongoDB connection string
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads' // This should match the collection name
                };
                resolve(fileInfo);
            });
        });
    }
});


const MaxFileSize: number = 1024 * 1024 * 5; // 5MB
//Before uploading the file, we need to check the file size, if it is too large, we will throw an error
const fileFilter = (req: MulterRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const fileSize: number = parseInt(req.headers['content-length'] || '0');
    if (fileSize > MaxFileSize) {
        cb(createHttpError(400, 'File size too large, cannot exceed 5MB!'));
    } else {
        cb(null, true);
    }
}
//the upload middleware will be used in the createRecipe and updateRecipe endpoints in router recipes.ts
//to intercept the request before it reaches the route handler(so then we can access the file property)
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter
    //The limit is buggy, so we will use fileFilter to check the file size
    // limits: {fileSize: 1024 * 1024 * 5} // 5MB
}).single('image');


//Callback function to return ALL recipes
export const getRecipes: RequestHandler = async (req, res, next) => {

    const authenticatedUserId = req.session.userId;

    try {
        //Assert that the user id is defined
        assertIsDefined(authenticatedUserId);

        //To retrieve all the documents from the "Recipe" collection.
        //We use "await" to pause the execution and wait for the
        //promise returned
        //We also filter the recipes by the user id, so that only the recipes created by the user will be returned
        const recipes = await RecipeModel.find({userId: authenticatedUserId}).exec();
        //The server responds with a JSON representation of the recipes array
        //200 indicates OK HTTP code
        res.status(200).json(recipes);
    } catch (error) {
        next(error);
    }
}
//Callback function to return a single recipe by using its recipeId
export const getRecipe: RequestHandler = async (req, res, next) => {
    //Has to be the same as "/:recipeId"
    const recipeId = req.params.recipeId;
    const authenticatedUserId = req.session.userId;
    try {
        //Assert that the user id is defined
        assertIsDefined(authenticatedUserId);

        //If the recipeId itself is not valid we throw error
        if (!mongoose.isValidObjectId(recipeId)) {
            throw createHttpError(400, "Invalid recipe id");
        }
        const recipe = await RecipeModel.findById(recipeId).exec();
        //If the recipe does not exist we also throw error
        if (!recipe) {
            throw createHttpError(404, "The recipe you are looking for doesn't exist");
        }

        //If the recipe does not belong to the authenticated user, we throw error
        if (!recipe.userId.equals(authenticatedUserId)) {
            throw createHttpError(403, "You are not authorized to access this recipe");
        }

        //Else we retrieve the recipe
        res.status(200).json(recipe);
    } catch (error) {
        next(error);
    }
};

//We define an interface(customize type) of the request body
//We will ensure that the request body will have either undefined(if user did not input) or string type
interface CreateRecipeBody {
    author?: string,
    title?: string,
    text?: string,
    isPublic?: boolean,
    imageName?: string,
    imageDesc?: string,
}

//We need to specify the type for request.body! That will be the third argument in the RequestHandler function signature
//We also need multerequest to access the file property
type CreateRecipeRequest = Request<unknown, unknown, CreateRecipeBody, unknown> & MulterRequest;

//Callback function to create a recipe
export const createRecipe = async (req: CreateRecipeRequest, res: Response, next: NextFunction) => {
    const author = req.body.author;
    const title = req.body.title;
    const text = req.body.text;
    const isPublic = req.body.isPublic !== undefined ? JSON.parse(req.body.isPublic) : true;
    const imageDesc = req.body.imageDesc;

    const authenticatedUserId = req.session.userId;

    try {
        //Assert that the user id is defined
        assertIsDefined(authenticatedUserId);

        //Throw error early if the title is undefined
        if (!title) {
            throw createHttpError(400, "Recipe title can not be empty!");
        }
        //Use Mongoose to create a new recipe
        const newRecipe = await RecipeModel.create({
            author: author,
            userId: authenticatedUserId,
            title: title,
            text: text,
            isPublic: isPublic,
            imageName: req.file?.filename, // The filename of the uploaded image
            imageDesc: imageDesc,
            //timestamp will be created automatically
        });
        //201 indicates HTTP code for a new resource created can also use 200(ok)
        res.status(201).json(newRecipe);
    } catch (error) {
        next(error);
    }
};


interface UpdateRecipeParams {
    recipeId: string,
}

interface UpdateRecipeBody {
    title?: string,
    text?: string,
    isPublic?: boolean,
    imageName?: string,
    imageDesc?: string
}

//We need to specify the type for request.body! That will be the third argument in the RequestHandler function signature
//We also need multerequest to access the file property
//We also need to specify the type for request.params! That will be the first argument in the RequestHandler function signature
type UpdateRecipeRequest = Request<UpdateRecipeParams, unknown, UpdateRecipeBody, unknown> & MulterRequest;

//Callback function to update the recipe
export const updateRecipe = async (req: UpdateRecipeRequest, res: Response, next: NextFunction) => {
    const recipeId = req.params.recipeId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const isPublic = req.body.isPublic !== undefined ? JSON.parse(req.body.isPublic) : undefined;
    const newImageDesc = req.body.imageDesc;

    const authenticatedUserId = req.session.userId;

    try {
        //Assert that the user id is defined
        assertIsDefined(authenticatedUserId);

        //If the recipeId itself is not valid we throw error
        if (!mongoose.isValidObjectId(recipeId)) {
            throw createHttpError(400, "Invalid recipe id");
        }
        const recipe = await RecipeModel.findById(recipeId).exec();

        //Throw error early if the title is undefined
        if (!newTitle) {
            throw createHttpError(400, "You can't update the recipe without a title!");
        }

        //If the recipe does not exist we also throw error
        if (!recipe) {
            throw createHttpError(404, "The recipe you are looking for doesn't exist");
        }

        //If the recipe does not belong to the authenticated user, we throw error
        if (!recipe.userId.equals(authenticatedUserId)) {
            throw createHttpError(403, "You are not authorized to access this recipe");
        }

        recipe.title = newTitle;
        recipe.text = newText;
        recipe.isPublic = isPublic !== undefined ? isPublic : recipe.isPublic; // If isPublic is undefined, we keep the old value
        recipe.imageDesc = newImageDesc;
        // Check if a new image file is provided
        if (req.file) {
            // Delete the old image file if it exists
            if (recipe.imageName) {
                const db = getDbConnection();
                const collection = db.collection('uploads.files');
                await collection.deleteOne({filename: recipe.imageName});
            }

            // Assign the new image file details to the recipe
            recipe.imageName = req.file.filename;
        }

        const updatedRecipe = await recipe.save();
        //or use RecipeModel.findByIdAndUpdate()

        res.status(200).json(updatedRecipe);
    } catch (error) {
        next(error);
    }
};

//Callback function to delete the recipe
export const deleteRecipe: RequestHandler = async (req, res, next) => {
    const recipeId = req.params.recipeId;
    const authenticatedUserId = req.session.userId;
    try {
        //Assert that the user id is defined
        assertIsDefined(authenticatedUserId);
        //If the recipeId itself is not valid we throw error
        if (!mongoose.isValidObjectId(recipeId)) {
            throw createHttpError(400, "Invalid recipe id");
        }

        const recipe = await RecipeModel.findById(recipeId).exec();

        //If the recipe does not exist we also throw error
        if (!recipe) {
            throw createHttpError(404, "The recipe you are looking for doesn't exist thus can't delete");
        }

        //If the recipe does not belong to the authenticated user, we throw error
        if (!recipe.userId.equals(authenticatedUserId)) {
            throw createHttpError(403, "You are not authorized to access this recipe");
        }

        if (recipe.imageName) {
            const db = getDbConnection();
            const chunksCollection = db.collection('uploads.chunks');
            const filesCollection = db.collection('uploads.files');

            //The image filename from recipes collection can link to the uploads.files collection,
            //Then from that specific entry form uploads.files collction, we can see the _id of the image file
            //Lastly, we can use that _id to delete the image file from uploads.chunks and uploads.files collection
            const file = await filesCollection.findOne({filename: recipe.imageName});
            if (file) {
                await chunksCollection.deleteMany({files_id: file._id});
                await filesCollection.deleteOne({_id: file._id});
            }
        }

        await recipe.deleteOne();
        //or RecipeModel.findByIdAndDelete(recipeId).exec()

        //Don't use status, use sendStatus to send the status if not sending json
        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
};
//Callback function to get the image of the recipe
export const getRecipeImage: RequestHandler = async (req, res, next) => {
    const recipeId = req.params.recipeId;

    try {
        const db = getDbConnection(); // Get the MongoDB database connection
        const bucket = new GridFSBucket(db, {bucketName: 'uploads'});

        const recipe = await RecipeModel.findById(recipeId).exec();

        // If the recipe does not exist, throw an error
        if (!recipe) {
            throw createHttpError(404, "The recipe you are looking for doesn't exist");
        }

        // Check if the recipe has an associated image
        if (!recipe.imageName) {
            // Send a response or default image
            res.status(404).send("No image found for this recipe");
            return;
        }

        // Retrieve the image file from GridFS using the recipe's imageName field
        const imageName = recipe.imageName;
        const imageStream = bucket.openDownloadStreamByName(imageName);

        // Set the appropriate Content-Type header based on the image file type
        res.set('Content-Type', 'image/jpeg');

        // Pipe the image stream to the response to send the image data
        imageStream.pipe(res);
    } catch (error) {
        next(error);
    }
};

//Callback function to get all public recipes
export const getPublicRecipes: RequestHandler = async (req, res, next) => {
    try {
        const recipes = await RecipeModel.find({isPublic: true}).exec();
        res.status(200).json(recipes);
    } catch (error) {
        next(error);
    }
}

interface SearchRecipesParams {
    term: string,
}

type SearchRecipesRequest = Request<unknown, unknown, unknown, SearchRecipesParams>;

export const searchRecipes = async (req: SearchRecipesRequest, res: Response, next: NextFunction) => {
    //Get the search query string from the request
    //The query string is the part of the URL after the ? character
    //For example, if the request is /recipes/search?term=soup, then the query string is "soup"
    const queryString = req.query.term;
    try {
        //Find all recipes that contain the search query string in their title or text
        //The $text operator is used to perform text search in MongoDB
        const recipes = await RecipeModel.find({
                //Use the $search operator to search for the query string in the title and text fields
                $text: {$search: queryString},
                //Only return public recipes(we don't want to search others' private recipes)
                isPublic: true
            },
            //Use the $meta operator to sort the results by the textScore
            //The textScore is a measure of how relevant the search results are to the search query
            //The higher the textScore, the more relevant the search result is
            {
                //Sort the results by the textScore in descending order
                score: {$meta: "textScore"}}) //end of find()
            .sort({score: {$meta: "textScore"}}).exec();

        res.status(200).json(recipes);
    } catch (error) {
        next(error);
    }
}





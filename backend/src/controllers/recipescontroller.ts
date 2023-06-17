import {RequestHandler} from "express";
import RecipeModel from "../models/recipe"
import createHttpError from "http-errors";
import mongoose from "mongoose";
import assertIsDefined from "../util/assertIsDefined";

//To create endpoints, the best practice is to define the callback functions first in recipescontroller.ts
//With the callback function, we can export it and use HTTP verb(GET, POST...) in recipes.ts with path that acts as router
//At last, in app.ts we use app.use() to utilize the router

//This would call a modular structure


//Callback function to return ALL recipes
export const getRecipes: RequestHandler = async (req, res, next) => {

    const authenticatedUserId = req.session.userId;

    try {
        //Assert that the user id is defined
        assertIsDefined(authenticatedUserId);

        //To retrieve all the documents from the "Recipe" collection.
        //We use "await" to pause the execution and wait for the
        //promise returned
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
    title?: string,
    text?: string,
}

//Callback function to create a recipe
//We need to specify the type for request.body! That will be the third argument in the RequestHandler function signature
export const createRecipe: RequestHandler<unknown, unknown, CreateRecipeBody, unknown> = async (req, res, next) => {

    const title = req.body.title;
    const text = req.body.text;
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
            userId: authenticatedUserId,
            title: title,
            text: text,
            //timestamp will be created automatically
        });
        //201 indicates HTTP code for a new resource created can also use 200(ok)
        res.status(201).json(newRecipe);
    } catch (error) {
        next(error);
    }
};

//Callback function to update the recipe
interface UpdateRecipeParams {
    recipeId: string,
}

interface UpdateRecipeBody {
    title?: string,
    text?: string,
}

export const updateRecipe: RequestHandler<UpdateRecipeParams, unknown, UpdateRecipeBody, unknown> = async (req, res, next) => {
    const recipeId = req.params.recipeId;
    const newTitle = req.body.title;
    const newText = req.body.text;
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

        await recipe.deleteOne();
        //or RecipeModel.findByIdAndDelete(recipeId).exec()

        //Don't use status, use sendStatus to send the status if not sending json
        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
};
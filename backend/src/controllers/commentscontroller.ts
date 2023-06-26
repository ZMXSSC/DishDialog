import {NextFunction, Request, RequestHandler, Response} from 'express';
import createHttpError from "http-errors";
import CommentModel from "../models/comment";
import RecipeModel from "../models/recipe";
import assertIsDefined from "../util/assertIsDefined";
import mongoose from "mongoose";


interface CreateCommentBody {
    text?: string
    recipe?: string
}


type CreateCommentRequest = Request<unknown, unknown, CreateCommentBody, unknown>;


export const createComment = async (req: CreateCommentRequest, res: Response, next: NextFunction) => {
    const text = req.body.text;
    const recipeId = req.body.recipe;  // get recipeId from request body
    const authenticatedUserId = req.session.userId;
    try {

        //Assert that the user id is defined
        assertIsDefined(authenticatedUserId);

        //Throw error early if the title is undefined
        if (!text || !recipeId) {
            throw createHttpError(400, "The comment can not be empty!");
        }

        //Use Mongoose to create a new comment
        //Make sure to associate the comment with the user who made it and the recipe it belongs to.
        const newComment = await CommentModel.create({
            text: text,
            recipe: recipeId,
            user: authenticatedUserId,

            //timestamp will be created automatically
        });
        const recipe = await RecipeModel.findById(recipeId);  //find the recipe by recipeid from database
        if (!recipe) {
            throw createHttpError(404, "Recipe not found, cannot push the comment");  //handle case where recipe is not found
        }
        //add comment id to recipe's comments array and save the recipe document to the database to update it
        //Now the recipe document has the new comment id in its comments array, and the comment document has the recipe id
        recipe.comments.push(newComment._id);
        await recipe.save();

        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
};

export const getComments: RequestHandler = async (req, res, next) => {
    try {
        //Use Mongoose to find all comments that belong to a recipe, and populate the user id with the username
        //the populate function will replace the user id with the user document, and only keep the username field, so that the response will only contain the username
        const comments = await CommentModel.find({recipe: req.params.recipeId}).populate('user', 'username').exec();
        console.log(comments); // Add this line to log the comments to the console
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
};

export const deleteComment: RequestHandler = async (req, res, next) => {
    const commentId = req.params.commentId;
    const authenticatedUserId = req.session.userId;
    try {
        //Assert that the user id is defined
        assertIsDefined(authenticatedUserId);
        //If the recipeId itself is not valid we throw error
        if (!mongoose.isValidObjectId(commentId)) {
            throw createHttpError(400, "Invalid comment id");
        }

        const comment = await CommentModel.findById(commentId).exec();

        //If the recipe does not exist we also throw error
        if (!comment) {
            throw createHttpError(404, "The comment you are looking for doesn't exist thus can't delete");
        }

        //If the recipe does not belong to the authenticated user, we throw error
        if (!comment.user.equals(authenticatedUserId)) {
            throw createHttpError(403, "You are not authorized to access this comment");
        }

        await comment.deleteOne();

        res.sendStatus(204);
    }catch (error){
        next(error);
    }

}
import {RequestHandler} from "express";
import createHttpError from "http-errors";

export const requiresAuth: RequestHandler = (req, res, next) => {
    if(req.session.userId){
        //If the user is authenticated, we will call the next middleware
        next();
    } else {
        next(createHttpError(401, "User not authenticated"));
    }
}
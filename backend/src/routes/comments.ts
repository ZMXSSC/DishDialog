import * as CommentsController from "../controllers/commentscontroller";
import express from "express";
import {requiresAuth} from "../middleware/auth";

const router = express.Router();

//Defining a route handler:
router.post("/", requiresAuth, CommentsController.createComment);

//We use recipeId to get all comments of a recipe
router.get("/:recipeId", CommentsController.getComments);

//delete request
router.delete("/:commentId", requiresAuth, CommentsController.deleteComment);

export default router;

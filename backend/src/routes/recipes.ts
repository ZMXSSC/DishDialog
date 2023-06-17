import * as RecipesController from "../controllers/recipescontroller";
import express from "express";

const router = express.Router();

//Defining a route handler:
router.get("/", RecipesController.getRecipes);
//"/:recipeId" is a route parameter defined in the URL pattern.
//It indicates that the segment of the URL following the / will be treated as the recipeId parameter.
router.get("/:recipeId", RecipesController.getRecipe);

router.post("/", RecipesController.createRecipe);
//patch request to change
router.patch("/:recipeId", RecipesController.updateRecipe);
//delete request
router.delete("/:recipeId", RecipesController.deleteRecipe);

export default router;
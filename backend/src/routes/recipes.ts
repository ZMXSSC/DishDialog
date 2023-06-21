import * as RecipesController from "../controllers/recipescontroller";
import {upload} from "../controllers/recipescontroller";
import express from "express";

const router = express.Router();

//Defining a route handler:
router.get("/", RecipesController.getRecipes);
//"/:recipeId" is a route parameter defined in the URL pattern.
//It indicates that the segment of the URL following the / will be treated as the recipeId parameter.


router.get("/:recipeId", RecipesController.getRecipe);

// router.post("/", RecipesController.createRecipe);

//upload.single('image') is a middleware that will be executed before the route handler.
//It will parse the incoming request and extract the image file from it.
//The image file will be stored in req.file.

//We also use fileLimitHandler middleware to check the file size, if it's too big, it will throw an error
//If the file size is ok, it will go to the next middleware which is upload.single('image')

router.post("/", upload, RecipesController.createRecipe);

//patch request to change
router.patch("/:recipeId", upload, RecipesController.updateRecipe);
//delete request
router.delete("/:recipeId", RecipesController.deleteRecipe);

router.get('/:recipeId/image', RecipesController.getRecipeImage);



export default router;
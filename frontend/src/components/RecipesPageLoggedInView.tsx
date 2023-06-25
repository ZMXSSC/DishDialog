import {Button, Col, Row, Spinner} from "react-bootstrap";
import stylesUtils from "../styles/utils.module.css";
import {FaPlus} from "react-icons/fa";
import styles from "../styles/RecipePage.module.css";
import AddEditRecipeDialog from "./AddEditRecipeDialog";
import React, {useEffect, useState} from "react";
import {Recipe as RecipeModel} from "../models/recipe";
import * as RecipesApi from "../network/recipes_api";
import Recipe from "./Recipe";
import {User} from "../models/user";

interface RecipesPageLoggedInViewProps {
    loggedInUser: User;
}

const RecipesPageLoggedInView = ({loggedInUser}: RecipesPageLoggedInViewProps) => {

    //Recipe[] means an array of Recipe objects, Setting up state that's going to be an array of Recipe objects
    const [recipes, setRecipes] = useState<RecipeModel[]>([]);
    //Create a state to determine if the recipe is loading(use when deploy on actual website which will cause delay)
    //Set it to true because as soon as we open the page, the recipes try to load
    const [recipesLoading, setRecipesLoading] = useState(true);
    //Create another state to show loading error, by default it will be false
    const [showRecipesLoadingError, setShowRecipesLoadingError] = useState(false);

    const [showAddRecipeDialog, setShowAddRecipeDialog] = useState(false);

    const [recipeToEdit, setRecipeToEdit] = useState<RecipeModel | null>(null);


    useEffect(() => {
        //loadRecipes() uses the Fetch API to send a GET request to the API endpoint
        //Then converts the response to JSON and updates the state with the recipes received.
        async function loadRecipes() {
            try {
                //When we are loading, we stop the error and init the loading status
                setShowRecipesLoadingError(false);
                setRecipesLoading(true);

                const recipes = await RecipesApi.fetchRecipes();
                //updates the recipes state with the fetched recipes using setRecipes()
                setRecipes(recipes);
            } catch (error) {
                console.error(error);
                setShowRecipesLoadingError(true);
            } finally {
                //either case, we need to set the loading status back to false when we're done loading
                setRecipesLoading(false);
            }
        }

        //Call the loadRecipes() function
        loadRecipes();
        //Need to put [] as it will only run exactly one time, rather than everytime the React renders
    }, []);


    async function deleteRecipe(recipe: RecipeModel) {
        // Check if user confirms the deletion
        try {
            await RecipesApi.deleteRecipe(recipe._id);
            //We need to tell the React to update the "recipes" state that we no longer have this recipe
            //We filter the recipe that has the same id as the recipe that we just deleted(if equal we don't keep)
            setRecipes(recipes.filter(existingRecipe => existingRecipe._id !== recipe._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }


    const recipesGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.recipesGrid}`}>

            {recipes.map(recipe => (
                // Col is used to add gap horizontally among recipes
                <Col key={recipe._id}>
                    <Recipe
                        recipe={recipe}
                        className={styles.recipe}
                        onRecipeClicked={(recipe) => setRecipeToEdit(recipe)}
                        onDeleteRecipeClicked={(recipe) => deleteRecipe(recipe)}
                    />
                </Col>
            ))}
        </Row>

    return (
        <>
            <Button
                //Clicking the "Add new recipe" button sets showAddRecipeDialog state to true,
                //which causes AddRecipeDialog.tsx to render(see below &&).
                variant='dark'
                className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
                onClick={() => setShowAddRecipeDialog(true)}>
                <FaPlus/>
                Add new recipe
            </Button>
            {/*If the recipe is loading, we display a spinner*/
            }
            {
                recipesLoading && <Spinner animation='border' variant='primary'/>
            }
            {/*If there's error loading the recipe, we display an error message to the user*/
            }
            {
                showRecipesLoadingError &&
                <p className={styles.errorMessage}>Something went wrong. Please refresh the page.</p>
            }
            {/*If recipe is not loading nor getting any error, then we display recipes(or if there's no recipe, remind
            user that there's no recipe*/
            }
            {
                !recipesLoading && !showRecipesLoadingError &&
                <>
                    {
                        recipes.length > 0
                            ? recipesGrid
                            : <p className={styles.errorMessage}>It's empty here. Create your own recipe now!</p>
                    }
                </>
            }
            {/*the && indicates that if showAddRecipeDialog is true(check above Button code that set it to true)
            ,the subsequent step will be taken, no otherwise*/
            }
            {
                showAddRecipeDialog &&
                //If the modal window does show up, we can set to false, so then we can close the window
                <AddEditRecipeDialog
                    loggedInUser={loggedInUser}
                    onDismiss={() => setShowAddRecipeDialog(false)}
                    onRecipeSaved={(newRecipe) => {
                        //Creates a new array with all the existing recipe, and it also adds the new recipe
                        setRecipes([...recipes, newRecipe])
                        setShowAddRecipeDialog(false);
                    }}
                />
            }
            {
                recipeToEdit &&
                <AddEditRecipeDialog
                    recipeToEdit={recipeToEdit}
                    onDismiss={() => setRecipeToEdit(null)}
                    onRecipeSaved={(updatedRecipe) => {
                        //We update the recipe in the array
                        setRecipes(recipes.map(existingRecipe => existingRecipe._id === updatedRecipe._id ? updatedRecipe : existingRecipe));
                        setRecipeToEdit(null);
                    }}
                />

            }
        </>
    )
        ;
}

export default RecipesPageLoggedInView;
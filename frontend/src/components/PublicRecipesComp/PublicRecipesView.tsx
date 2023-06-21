import {Col, Row, Spinner} from "react-bootstrap";
import styles from "../../styles/RecipePage.module.css";
import React, {useEffect, useState} from "react";
import {Recipe as RecipeModel} from "../../models/recipe";
import * as RecipesApi from "../../network/recipes_api";
import PublicRecipe from "./PublicRecipe";


const PublicRecipesView = () => {

    //Recipe[] means an array of Recipe objects, Setting up state that's going to be an array of Recipe objects
    const [recipes, setRecipes] = useState<RecipeModel[]>([]);
    //Create a state to determine if the recipe is loading(use when deploy on actual website which will cause delay)
    //Set it to true because as soon as we open the page, the recipes try to load
    const [recipesLoading, setRecipesLoading] = useState(true);
    //Create another state to show loading error, by default it will be false
    const [showRecipesLoadingError, setShowRecipesLoadingError] = useState(false);



    useEffect(() => {
        //loadRecipes() uses the Fetch API to send a GET request to the API endpoint
        //Then converts the response to JSON and updates the state with the recipes received.
        async function loadRecipes() {
            try {
                //When we are loading, we stop the error and init the loading status
                setShowRecipesLoadingError(false);
                setRecipesLoading(true);

                const recipes = await RecipesApi.fetchPublicRecipes();
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




    const recipesGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.recipesGrid}`}>

            {recipes.map(recipe => (
                // Col is used to add gap horizontally among recipes
                <Col key={recipe._id}>
                    <PublicRecipe
                        recipe={recipe}
                        className={styles.recipe}
                    />
                </Col>
            ))}
        </Row>

    return (
        <>
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
                            : <p className={styles.errorMessage}>It's empty here. Check later!</p>
                    }
                </>
            }

        </>
    )
        ;
}

export default PublicRecipesView;


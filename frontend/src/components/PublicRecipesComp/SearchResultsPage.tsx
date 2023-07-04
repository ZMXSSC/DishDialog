import {useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import {getRecipesBySearchTerm} from "../../network/recipes_api";
import {Recipe} from "../../models/recipe";
import PublicRecipe from "./PublicRecipe";
import {Col, Container, Row, Spinner} from "react-bootstrap";
import styles from "../../styles/RecipePage.module.css";
import {User} from "../../models/user";

interface SearchPageProps {
    loggedInUser: User | null;
}
const SearchPage = ({loggedInUser} : SearchPageProps) => {
    //useLocation is a hook that returns the location object that represents the current URL
    //the location object contains information about the current URL, such as the path, search query, and hash

    //For example, for "http://localhost:3000/search?term=321", the "pathname" is "/search",
    //the "search" is "?term=321", and the "hash" is ""
    //We can use the search query to get the search term that the user entered!
    const location = useLocation();
    //the search query is the part of the URL after the ? character
    //for example, for "http://localhost:3000/search?term=321", the search query is "?term=321"
    const query = new URLSearchParams(location.search);
    //the get method of the URLSearchParams object allows us to get the value of a query parameter
    //for example, for "http://localhost:3000/search?term=321", query.get('term') will return "321"
    //And that's how we get the search term that the user entered!
    const term = query.get('term') || '';

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [recipesLoading, setRecipesLoading] = useState(true);
    const [showRecipesLoadingError, setShowRecipesLoadingError] = useState(false);

    //useEffect is a hook that allows us to perform side effects in function components
    //useEffect is being used to fetch the recipes that match the search term when the component first mounts.
    //The effect will also run whenever the search term changes.
    useEffect(() => {
        const loadRecipes = async () => {
            try {
                setRecipesLoading(true);
                const result = await getRecipesBySearchTerm(term);
                setRecipes(result);
            } catch (error) {
                console.error(error);
                setShowRecipesLoadingError(true);
            } finally {
                setRecipesLoading(false);
            }
        };
        loadRecipes();
        //the term variable is a dependency of the effect, so the effect will run whenever the term variable changes
        //this means that the effect will run whenever the user enters a new search term
    }, [term]);

    const recipesGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.recipesGrid}`}>
            {recipes.map(recipe => (
                <Col key={recipe._id}>
                    <PublicRecipe
                        loggedInUser={loggedInUser}
                        recipe={recipe}
                        className={styles.recipe}
                    />
                </Col>
            ))}
        </Row>;

    return (
        <Container className={styles.recipesPage}>
            <h1>Search Results for "{term}"</h1>
            {recipesLoading && <Spinner animation='border' variant='primary'/>}
            {showRecipesLoadingError &&
                <>
                    <p className={styles.errorMessage}>
                        Something went wrong. Please refresh the page.</p>
                    <p className={styles.errorMessage}>
                        If you haven't signed in yet, please sign in to search.</p>
                </>
            }
            {!recipesLoading && !showRecipesLoadingError &&
                (recipes.length > 0
                    ? recipesGrid
                    : <p className={styles.errorMessage}>No results found</p>)
            }
        </Container>
    );
};

export default SearchPage;

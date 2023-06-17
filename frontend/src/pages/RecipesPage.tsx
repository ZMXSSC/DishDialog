import {Container} from "react-bootstrap";
import styles from "../styles/RecipePage.module.css";
import RecipesPageLoggedInView from "../components/RecipesPageLoggedInView";
import RecipesPageLoggedOutView from "../components/RecipesPageLoggedOutView";
import {User} from "../models/user";

interface RecipesPageProps {
    loggedInUser: User | null;
}

const RecipesPage = ({loggedInUser}: RecipesPageProps) => {
    return (
        <Container className={styles.recipesPage}>
            <>
                {loggedInUser
                    ? <RecipesPageLoggedInView/>
                    : <RecipesPageLoggedOutView/>
                }
            </>
        </Container>
    );
}

export default RecipesPage;
import {Container} from "react-bootstrap";
import styles from "../styles/RecipePage.module.css";
import PublicRecipesView from "../components/PublicRecipesComp/PublicRecipesView";

const CommunityPage = () => {
    return (
        <Container className={styles.recipesPage}>
            <PublicRecipesView/>
        </Container>
    );
}

export default CommunityPage;
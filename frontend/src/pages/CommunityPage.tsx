import {Container} from "react-bootstrap";
import styles from "../styles/RecipePage.module.css";
import PublicRecipesView from "../components/PublicRecipesComp/PublicRecipesView";
import {User} from "../models/user";

interface CommunityPageProps {
    loggedInUser: User | null;
}

const CommunityPage = ({loggedInUser}: CommunityPageProps) => {
    return (
        <Container className={styles.recipesPage}>
            <PublicRecipesView loggedInUser={loggedInUser}/>
        </Container>
    );
}

export default CommunityPage;
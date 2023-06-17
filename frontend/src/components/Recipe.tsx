import {Recipe as RecipeModel} from "../models/recipe"
import {Card} from 'react-bootstrap'
import styles from "../styles/Recipe.module.css"
import styleUtils from "../styles/utils.module.css"
import {formatDate} from "../utils/formatDate";
import {MdDelete} from "react-icons/md";
import {useState} from "react";

import ConfirmationDialog from './ConfirmationDialog';
import RecipeDetailDialog from "./RecipeDetailedDialog";

interface RecipeProps {
    recipe: RecipeModel,
    onRecipeClicked: (recipe: RecipeModel) => void,
    onDeleteRecipeClicked: (recipe: RecipeModel) => void,
    className?: string,
}

const Recipe = ({recipe, onRecipeClicked, onDeleteRecipeClicked, className}: RecipeProps) => {

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [RecipeDetail, setRecipeDetail] = useState<RecipeModel | null>(null);  // New state

    //We can further unpack, not necessary though
    const {
        title,
        text,
        createdAt,
        updatedAt
    } = recipe;

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }


    return (
        // This is a prop passed into the Recipe component, allowing whoever uses the Recipe component to optionally
        // add additional styling on top of the base styles(i.e. className that was assigned in App.tsx).
        // Wrapper starts
        <>
            <Card
                className={`${styles.recipeCard} ${className}`}
                // onClick={() => onRecipeClicked(recipe)}
                onClick={() => setRecipeDetail(recipe)}  // Open the detail dialog instead
            >
                <Card.Body className={styles.cardBody}>
                    <Card.Title className={styleUtils.flexCenter}>
                        <div className={styles.titleBorder}>
                            <span className={styles.title}>
                                {title}
                            </span>
                        </div>
                        <MdDelete
                            //The ms-auto class applies automatic margin to the left of the icon,
                            //pushing it to the far right of the flex container (Card.Title).
                            className="text-muted ms-auto"
                            onClick={(e) => {
                                // onDeleteRecipeClicked(recipe);
                                //This is to prevent the event from bubbling up to parent components and
                                //inadvertently triggering the onRecipeClicked event which is associated with the whole recipe card.
                                //If we don't stop propagation, the onRecipeClicked will also trigger
                                e.stopPropagation();
                                // e.preventDefault();
                                setShowConfirmDelete(true);
                            }}
                        />
                    </Card.Title>
                    <Card.Text className={styles.cardText}>
                        {text}
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">
                    {createdUpdatedText}
                </Card.Footer>
            </Card>
            {RecipeDetail &&
                <RecipeDetailDialog
                    recipe={RecipeDetail}
                    onDismiss={() => setRecipeDetail(null)}
                    onEdit={() => {
                        onRecipeClicked(RecipeDetail);
                        setRecipeDetail(null);
                    }}
                    onDelete={() => {
                        onDeleteRecipeClicked(RecipeDetail);
                        setRecipeDetail(null);
                    }}
                />
            }

            {/*Second element*/}
            <ConfirmationDialog
                show={showConfirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this recipe?"
                onConfirm={() => {
                    //calling deleteRecipe in App.tsx, passing the recipe in it
                    onDeleteRecipeClicked(recipe);
                    setShowConfirmDelete(false);
                }}
                onCancel={() => setShowConfirmDelete(false)}
            />
            {/*Wrapper ends*/}
        </>

    )
}

export default Recipe;

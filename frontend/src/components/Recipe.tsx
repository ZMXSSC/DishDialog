import {Recipe as RecipeModel} from "../models/recipe"
import {Card} from 'react-bootstrap'
import styles from "../styles/Recipe.module.css"
import styleUtils from "../styles/utils.module.css"
import {formatDate} from "../utils/formatDate";
import {MdDelete} from "react-icons/md";
import {useState} from "react";

import ConfirmationDialog from './ConfirmationDialog';
import RecipeNoImgDetailDialog from "./RecipeNoImgDetailedDialog";
import RecipeImgDetailDialog from "./RecipeImgDetailedDialog";
import {User} from "../models/user";

interface RecipeProps {
    loggedInUser: User,
    recipe: RecipeModel,
    onRecipeClicked: (recipe: RecipeModel) => void,
    onDeleteRecipeClicked: (recipe: RecipeModel) => void,
    className?: string,
}

const Recipe = ({loggedInUser, recipe, onRecipeClicked, onDeleteRecipeClicked, className}: RecipeProps) => {

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [RecipeNoImgDetail, setRecipeNoImgDetail] = useState<RecipeModel | null>(null);
    const [RecipeImgDetail, setRecipeImgDetail] = useState<RecipeModel | null>(null);
    const [hasImage, setHasImage] = useState(true);  // New state for checking if image exists

    //We can further unpack, not necessary though
    const {
        title,
        text,
        // image,
        createdAt,
        updatedAt,
        _id
    } = recipe;

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }

    const imageUrl = `/api/recipes/${_id}/image/`;  // The URL to the image

    return (
        // This is a prop passed into the Recipe component, allowing whoever uses the Recipe component to optionally
        // add additional styling on top of the base styles(i.e. className that was assigned in App.tsx).
        // Wrapper starts
        <>
            {hasImage ? (
                <Card className={`${styles.recipeCard} ${className}`} onClick={() => setRecipeImgDetail(recipe)}>
                    <Card.Img variant="top" src={imageUrl} className={`${styles.imageStyle} ${imageUrl}`}
                              onError={() => setHasImage(false)}/>
                    <Card.Footer className="text-muted">
                        <div className={styles.titleBorder}>
                        <span className={styles.title}>
                            {title}
                        </span>
                        </div>
                        <span className={styles.title}>
                            {loggedInUser.username}
                            </span>
                        {createdUpdatedText}
                        <MdDelete
                            //The ms-auto class applies automatic margin to the left of the icon,
                            //pushing it to the far right of the flex container (Card.Title).
                            className="text-muted float-end"
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
                    </Card.Footer>
                </Card>

            ) : (
                <Card
                    className={`${styles.recipeCard} ${className}`}
                    onClick={() => setRecipeNoImgDetail(recipe)}
                >
                    <Card.Body className={styles.cardBody}>
                        <Card.Title className={styleUtils.flexCenter}>
                            <div className={styles.titleBorder}>
                                <span className={styles.title}>
                                    {title}
                                </span>
                            </div>
                            <MdDelete
                                className="text-muted ms-auto"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowConfirmDelete(true);
                                }}
                            />
                        </Card.Title>
                        <Card.Text className={styles.cardText}>
                            {text}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className={`${styles.timestamp} text-muted`}>
                            <span className={styles.title}>
                            {loggedInUser.username}
                            </span>
                        {createdUpdatedText}
                    </Card.Footer>
                </Card>
            )}

            {RecipeNoImgDetail &&
                <RecipeNoImgDetailDialog
                    recipe={RecipeNoImgDetail}
                    onDismiss={() => setRecipeNoImgDetail(null)}
                    onEdit={() => {
                        onRecipeClicked(RecipeNoImgDetail);
                        setRecipeNoImgDetail(null);
                    }}
                    onDelete={() => {
                        onDeleteRecipeClicked(RecipeNoImgDetail);
                        setRecipeNoImgDetail(null);
                    }}
                />
            }

            {RecipeImgDetail &&
                <RecipeImgDetailDialog
                    recipe={RecipeImgDetail}
                    onDismiss={() => setRecipeImgDetail(null)}
                    onEdit={() => {
                        onRecipeClicked(RecipeImgDetail);
                        setRecipeImgDetail(null);
                    }}
                    onDelete={() => {
                        onDeleteRecipeClicked(RecipeImgDetail);
                        setRecipeImgDetail(null);
                    }}
                />
            }
            {/*THIRD element*/}
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

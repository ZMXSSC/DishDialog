import {Recipe as RecipeModel} from "../../models/recipe"
import {Card} from 'react-bootstrap'
import styles from "../../styles/Recipe.module.css"
import styleUtils from "../../styles/utils.module.css"
import {formatDate} from "../../utils/formatDate";
import {useState} from "react";

import RecipeNoImgDetailDialog from "../RecipeNoImgDetailedDialog";
import RecipeImgDetailDialog from "../RecipeImgDetailedDialog";
import {User} from "../../models/user";

interface PublicRecipeProps {
    loggedInUser: User | null,
    recipe: RecipeModel,
    className?: string,
}

const PublicRecipe = ({loggedInUser, recipe, className}: PublicRecipeProps) => {

    const [RecipeNoImgDetail, setRecipeNoImgDetail] = useState<RecipeModel | null>(null);
    const [RecipeImgDetail, setRecipeImgDetail] = useState<RecipeModel | null>(null);
    const [hasImage, setHasImage] = useState(true);  // New state for checking if image exists

    //We can further unpack, not necessary though
    const {
        author,
        title,
        text,
        // image,
        createdAt,
        updatedAt,
        _id
    } = recipe;

    let createdUpdatedText: string;
    const createdAtDate = "Created: " + formatDate(createdAt);
    const updatedAtDate = "Updated: " + formatDate(updatedAt);
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
                            {author}
                            </span>
                        {createdUpdatedText}
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
                        </Card.Title>
                        <Card.Text className={styles.cardText}>
                            {text}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className={`${styles.timestamp} text-muted`}>
                            <span className={styles.title}>
                            {author}
                            </span>
                        {createdUpdatedText}
                    </Card.Footer>
                </Card>
            )}

            {RecipeNoImgDetail &&
                <RecipeNoImgDetailDialog
                    loggedInUser={loggedInUser}
                    isPublic={true}
                    recipe={RecipeNoImgDetail}
                    onDismiss={() => setRecipeNoImgDetail(null)}
                    createdAtString={createdAtDate}
                    updatedAtString={updatedAtDate}
                />
            }

            {RecipeImgDetail &&
                <RecipeImgDetailDialog
                    loggedInUser={loggedInUser}
                    isPublic={true}
                    recipe={RecipeImgDetail}
                    onDismiss={() => setRecipeImgDetail(null)}
                    createdAtString={createdAtDate}
                    updatedAtString={updatedAtDate}
                />
            }
            {/*Wrapper ends*/}
        </>

    )
}

export default PublicRecipe;

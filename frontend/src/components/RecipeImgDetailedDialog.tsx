import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Form, Image, Modal, Row} from 'react-bootstrap';
import {Recipe as RecipeModel} from "../models/recipe";
import styles from "../styles/Recipe.module.css";
import ConfirmationDialog from "./ConfirmationDialog"
import CommentSection from "./PublicRecipesComp/CommentSection";
import {useForm} from "react-hook-form";
import TextInputField from "./form/TextInputField";
import {CommentInput, createComment} from "../network/recipes_api";
import {User} from "../models/user";

interface RecipeDetailDialogProps {
    loggedInUser?: User | null,
    recipe: RecipeModel,
    onDismiss: () => void,
    onEdit?: () => void,
    onDelete?: () => void
    createdAtString: string,
    updatedAtString: string,
    isPublic?: boolean
}

const RecipeImgDetailDialog: React.FC<RecipeDetailDialogProps> = ({
                                                                      loggedInUser,
                                                                      recipe,
                                                                      onDismiss,
                                                                      onEdit,
                                                                      onDelete,
                                                                      createdAtString, updatedAtString, isPublic
                                                                  }: RecipeDetailDialogProps) => {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const [commentSubmitted, setCommentSubmitted] = useState(false);

    const {register, handleSubmit, reset, formState: {errors}} = useForm<CommentInput>();
    const onSubmit = async (input: CommentInput) => {
        try {
            const commentData: CommentInput = {
                text: input.text,
                user: loggedInUser?._id || '',
                recipe: recipe._id
            };

            await createComment(commentData);
            setCommentSubmitted(true);

            // clear the form after submission
            reset();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // Trigger re-render of the CommentSection component when commentSubmitted changes
        setCommentSubmitted(false);
    }, [commentSubmitted]);


    return (
        <div>
            <Modal show={true} onHide={onDismiss} dialogClassName={styles.modal90w}>
                <Modal.Header closeButton>
                    <Modal.Title>{recipe.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.cardText}>
                    <Container fluid>
                        <Row>
                            <Col md={5}>
                                <Image src={`/api/recipes/${recipe._id}/image/`} rounded className={styles.imageStyle}/>
                                <div style={{padding: '25px'}}>{recipe.imageDesc}</div>
                            </Col>
                            <Col className={styles.textBody} md={4}>
                                <div style={{fontSize: '25px'}}>{recipe.text}</div>
                            </Col>
                            <Col md={3}>
                                <Row md={11} className={styles.commentSectionRow}>
                                    <div className={styles.commentSectionContainer}>
                                        <CommentSection key={commentSubmitted.toString()} recipeId={recipe._id}/>
                                    </div>
                                </Row>
                                <Row md={1}>
                                    {loggedInUser ? (
                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <TextInputField
                                                name="text"
                                                label="Add your comment!"
                                                register={register}
                                                registerOptions={{required: 'Comment is required.'}}
                                                error={errors.text}
                                            />
                                            <Button variant="primary" type="submit">Submit</Button>
                                        </Form>
                                    ) : (
                                        <p style={{fontSize: '20px', color: 'red'}}>
                                            Please log in to write your comment.
                                        </p>
                                    )}
                                </Row>

                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <p style={{padding: '10px', whiteSpace: 'pre-wrap'}}>
                        {createdAtString}
                        <br/>
                        {updatedAtString}
                    </p>
                    <Button variant="secondary" onClick={onDismiss}>Close</Button>
                    {!isPublic &&
                        <>
                            <Button variant="primary" onClick={onEdit}>Edit</Button>
                            <Button variant="danger" onClick={() => setShowConfirmDelete(true)}>Delete</Button>
                        </>
                    }
                </Modal.Footer>
            </Modal>
            {!isPublic &&
                <ConfirmationDialog
                    show={showConfirmDelete}
                    title="Confirm Delete"
                    message="Are you sure you want to delete this recipe?"
                    onConfirm={() => {
                        if (onDelete) {
                            onDelete();
                        }
                        setShowConfirmDelete(false);
                    }}
                    onCancel={() => setShowConfirmDelete(false)}
                />
            }

        </div>
    );
}

export default RecipeImgDetailDialog;

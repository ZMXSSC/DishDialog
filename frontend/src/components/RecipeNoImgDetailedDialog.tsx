import React, {useState} from 'react';
import {Modal, Button, Container, Row, Col} from 'react-bootstrap';
import {Recipe as RecipeModel} from "../models/recipe";
import styles from "../styles/Recipe.module.css";
import ConfirmationDialog from "./ConfirmationDialog"
import CommentSection from "./PublicRecipesComp/CommentSection";

interface RecipeDetailDialogProps {
    recipe: RecipeModel,
    onDismiss: () => void,
    onEdit?: () => void,
    onDelete?: () => void
    createdAtString: string,
    updatedAtString: string,
    isPublic?: boolean
}

const RecipeNoImgDetailDialog: React.FC<RecipeDetailDialogProps> = ({
                                                                        recipe,
                                                                        onDismiss,
                                                                        onEdit,
                                                                        onDelete,
                                                                        createdAtString,
                                                                        updatedAtString,
                                                                        isPublic
                                                                    }) => {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    return (
        <div>
            <Modal show={true} onHide={onDismiss} dialogClassName={styles.modal60w}>
                <Modal.Header closeButton>
                    <Modal.Title>{recipe.title}</Modal.Title>
                </Modal.Header>
                {/*<Modal.Body className={`${styles.cardText} ${styles.textBody}`}>*/}
                {/*    <div style={{fontSize: '25px'}}>{recipe.text}</div>*/}
                {/*</Modal.Body>*/}
                <Modal.Body className={styles.cardText}>
                    <Container fluid>
                        <Row>
                            <Col className={styles.textBody} md={8}>
                                <div style={{fontSize: '25px'}}>{recipe.text}</div>
                            </Col>
                            <Col md={4}>
                                <CommentSection recipe={recipe}/>
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
                    onCancel={() => setShowConfirmDelete(false)}/>
            }
        </div>
    );
}

export default RecipeNoImgDetailDialog;
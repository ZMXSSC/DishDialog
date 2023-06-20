import React, {useState} from 'react';
import {Modal, Button, Container, Row, Col, Image} from 'react-bootstrap';
import {Recipe as RecipeModel} from "../models/recipe";
import styles from "../styles/Recipe.module.css";
import ConfirmationDialog from "./ConfirmationDialog"

interface RecipeDetailDialogProps {
    recipe: RecipeModel,
    onDismiss: () => void,
    onEdit: () => void,
    onDelete: () => void,
    createdAtString: string,
    updatedAtString: string,
}

const RecipeImgDetailDialog: React.FC<RecipeDetailDialogProps> = ({
                                                                        recipe,
                                                                        onDismiss,
                                                                        onEdit,
                                                                        onDelete,
                                                                        createdAtString, updatedAtString
                                                                    }) => {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    return (
        <div>
            <Modal show={true} onHide={onDismiss} dialogClassName={styles.modal90w}>
                <Modal.Header closeButton>
                    <Modal.Title>{recipe.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.cardText}>
                    <Container>
                        <Row>
                            <Col>
                                <Image src={`/api/recipes/${recipe._id}/image/`} rounded className={styles.imageStyle}/>
                                <div style={{padding: '25px'}}>{recipe.imageDesc}</div>
                            </Col>
                            <Col className={styles.textBody}>
                                <div style={{fontSize: '25px'}}>{recipe.text}</div>
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
                    <Button variant="primary" onClick={onEdit}>Edit</Button>
                    <Button variant="danger" onClick={() => setShowConfirmDelete(true)}>Delete</Button>
                </Modal.Footer>
            </Modal>
            <ConfirmationDialog
                show={showConfirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this recipe?"
                onConfirm={() => {
                    onDelete();
                    setShowConfirmDelete(false);
                }}
                onCancel={() => setShowConfirmDelete(false)}
            />
        </div>
    );
}

export default RecipeImgDetailDialog;

import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Recipe as RecipeModel } from "../models/recipe";
import styles from "../styles/Recipe.module.css";
import ConfirmationDialog from "./ConfirmationDialog"

interface RecipeDetailDialogProps {
    recipe: RecipeModel,
    onDismiss: () => void,
    onEdit: () => void,
    onDelete: () => void
}

const RecipeDetailDialog: React.FC<RecipeDetailDialogProps> = ({ recipe, onDismiss, onEdit, onDelete }) => {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    return (
        <div>
            <Modal show={true} onHide={onDismiss}>
                <Modal.Header closeButton>
                    <Modal.Title>{recipe.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.cardText}>
                    {recipe.text}
                </Modal.Body>
                <Modal.Footer>
                    ··
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

export default RecipeDetailDialog;

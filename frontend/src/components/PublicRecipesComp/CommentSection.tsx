import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import {Recipe as RecipeModel} from "../../models/recipe";

interface CommentSectionProps {
    recipe: RecipeModel
}

const CommentSection = ({recipe}: CommentSectionProps) => {
    console.log(recipe);

    return(
        <div>
            Here is the comment section!
        </div>
    )
}

export default CommentSection;
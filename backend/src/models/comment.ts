import {InferSchemaType, model, Schema} from "mongoose";

const commentSchema = new Schema({
    //Each of the comment need to have a comment text
    text: {
        type: String,
        required: true
    },
    //Each comment need to have a user id that ties to the owner of the comment
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    //Each comment need to tie to a recipe
    recipe: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    }
    //Timestamp can be done by mongoose, so we don't need to define it here
}, {timestamps: true});

//Create a type for typescript
type Comment = InferSchemaType<typeof commentSchema>;

//export the model for external use
//                         create "User" collection in MongoDB
export default model<Comment>("Comment", commentSchema);

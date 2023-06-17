import {model, Schema, InferSchemaType} from "mongoose";

const recipeSchema = new Schema({
    //Each of the recipe need to have a user id that ties to the owner
    userId: {type: Schema.Types.ObjectId, required: true},
    //Each of the recipe need to have title, content and timestamp
    title: {type: String, required: true},
    text: {type: String},
    //Timestamp can be done by mongoose, so we don't need to define it here

    //We can do it here:
}, {timestamps: true});


//Create a type for typescript
type Recipe = InferSchemaType<typeof recipeSchema>;

//export the model for external use
//                         create "Recipe" collection in MongoDB
export default model<Recipe>("Recipe", recipeSchema);

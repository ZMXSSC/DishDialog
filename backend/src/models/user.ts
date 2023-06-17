import {InferSchemaType, model, Schema} from "mongoose";

const userSchema = new Schema({
    //Each user need to have their username, email and password registered

    //unique ensure only one username/email could be inserted to the database(no duplicate possible)
    username: {type: String, required: true, unique: true},
    //the false here indicate when we retrieve the data, email and password won't be return by default
    //unless we explicitly request to retrieve those for the sake of safety
    email: {type: String, required: true, unique: true, select: false},
    password: {type: String, required: true, select: false},
});

//Create a type for typescript
type User = InferSchemaType<typeof userSchema>;

//export the model for external use
//                         create "User" collection in MongoDB
export default model<User>("User", userSchema);

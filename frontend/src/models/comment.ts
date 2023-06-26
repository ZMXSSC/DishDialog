//Describe what each comment should have
import {User} from "./user";

export interface Comment {
    _id: string,
    text: string,
    user: User,  // user object including username and _id
    recipe: string, // recipe id
    createdAt: string,
    updatedAt: string
}

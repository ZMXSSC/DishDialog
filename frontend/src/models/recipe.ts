//Describe what each recipe should have
export interface Recipe {
    //we received json so everything should be string
    _id: string,
    author: string,
    title: string,
    text?: string,
    image?: File,
    imageDesc?: string,
    isPublic: boolean,
    createdAt: string,
    updatedAt: string
}
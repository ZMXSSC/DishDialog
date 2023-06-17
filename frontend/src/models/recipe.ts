//Describe what each recipe should have
export interface Recipe {
    //we received json so everything should be string
    _id: string,
    title: string,
    text?: string,
    createdAt: string,
    updatedAt: string
}
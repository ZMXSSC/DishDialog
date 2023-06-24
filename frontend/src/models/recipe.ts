//Describe what each recipe should have
export interface Recipe {
    _id: string,
    author: string,
    title: string,
    text?: string,
    image?: File,
    imageDesc?: string,
    hasImage: boolean,
    isPublic: boolean,
    longitude?: number,
    latitude?: number,
    createdAt: string,
    updatedAt: string
}
import {Recipe} from "../models/recipe";
import {User} from "../models/user";
import {ConflictError, UnauthorizedError} from "../errors/http_errors";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {//between 200 and 300
        return response;
    } else { //We need to handle error from the response(backend)
        const errorBody = await response.json();
        const errorMessage = errorBody.error;

        if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw Error("Request failed with status:" + response.status + " and message:" + errorMessage);
        }
    }
}

export async function fetchRecipes(): Promise<Recipe[]> {
    const response = await fetchData("/api/recipes", {method: "GET"});
    return response.json();
}

export interface RecipeInput {
    title: string,
    text?: string,
    image?: File,
    imageDesc?: string,
}

// export async function createRecipe(recipe: RecipeInput): Promise<Recipe> {
//     const response = await fetchData("/api/recipes",
//         {
//             method: "POST",
//             //Since we are making a POST request, IT'S IMPORTANT TO SPECIFY headers and body(No need for GET)
//             //headers to indicate what kind of data we are sending
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             //pass the body
//             body: JSON.stringify(recipe),
//         });
//     return response.json();
// }
export async function createRecipe(recipe: FormData): Promise<Recipe> {
    const requestOptions: RequestInit = {
        method: "POST",
        body: recipe
        //For formData, we don't need to specify headers, because it will be automatically set
        //by the browser
    };

    const response = await fetchData("/api/recipes", requestOptions);
    return response.json();
}


export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("/api/users", {method: "GET"});
    return response.json();
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("/api/users/signup",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials),
        });
    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData("/api/users/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials),
        });
    return response.json();
}

export async function logout() {
    await fetchData("/api/users/logout", {method: "POST"});
}

// export async function updateRecipe(recipeId: string, recipe: RecipeInput | FormData): Promise<Recipe> {
//
//     const response = await fetchData("/api/recipes/" + recipeId,
//         {
//             method: "PATCH",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(recipe),
//         });
//     return response.json();
// }

export async function updateRecipe(recipeId: string, recipe: FormData): Promise<Recipe> {
    const requestOptions: RequestInit = {
        method: "PATCH",
        body: recipe
        //Again, we don't need to specify headers for formData, because it will be automatically set
        //by the browser
    }
    const response = await fetchData("/api/recipes/" + recipeId, requestOptions);
    return response.json();
}

export async function deleteRecipe(recipeId: string) {
    await fetchData("/api/recipes/" + recipeId, {method: "DELETE"});
}
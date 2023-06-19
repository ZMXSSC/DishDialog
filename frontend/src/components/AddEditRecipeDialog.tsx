import {Button, Form, Modal} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {Recipe} from "../models/recipe";
import {RecipeInput} from "../network/recipes_api";
import * as RecipesApi from "../network/recipes_api"
import TextInputField from "./form/TextInputField";
import FileInputField from "./form/FileInputField";
import {useState} from "react";

interface AddEditRecipeDialogProps {
    recipeToEdit?: Recipe,
    onDismiss: () => void,
    onRecipeSaved: (recipe: Recipe) => void
}

//The Dialog(pop up window) that we design to create new recipe
const AddEditRecipeDialog = ({recipeToEdit, onDismiss, onRecipeSaved}: AddEditRecipeDialogProps) => {

    //from react-hook-form
    //register is used to collect input from each input form
    //handleSubmit is used to collect all registers and pass it to a callback function(that could utilize these inputs)
    //errors is an object with field errors.(In this code we can access errors.title or errors.text to see if there's error
    //isSubmitting return true if the form is currently being submitted. false otherwise.
    const {
        register, handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<RecipeInput>({
        defaultValues: {
            title: recipeToEdit?.title || "",
            text: recipeToEdit?.text || "",
        }
    });

    //file is the file that the user select from the file dialog
    const [file, setFile] = useState<File | undefined>();

    async function Sub(input: RecipeInput) {
        try {
            let recipeResponse: Recipe;
            const formData = new FormData();
            formData.append("title", input.title);
            formData.append("text", input.text || "");
            if (file) {
                formData.append("image", file);
            }
            if (recipeToEdit) {
                //If we are editing an existing recipe
                recipeResponse = await RecipesApi.updateRecipe(recipeToEdit._id, formData);
            } else {
                //If we are creating a new recipe
                recipeResponse = await RecipesApi.createRecipe(formData);
            }
            onRecipeSaved(recipeResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }


    return (
        //When the onHide event is triggered (for example, when you click outside the modal or press the escape key),
        //the onDismiss function is called, which in turn calls setShowAddRecipeDialog(false) from App.tsx
        //onHide => onDismiss => setShowAddRecipeDialog(false), chain reaction
        <Modal show={true} onHide={() => onDismiss()}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {recipeToEdit ? "Edit recipe" : "Add recipe"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/*When we call handleSubmit(Sub), we find the input from Sub is missing, right? */}
                {/*It actually handled by ...register when we call handleSubmit, basically they will collect all*/}
                {/*the input's value and automatically pass to Sub. The react-hook-form library done everything for us.*/}
                <Form id="addEditRecipeForm" onSubmit={handleSubmit(Sub)} encType="multipart/form-data">
                    <TextInputField
                        rows={2}
                        name="title"
                        label="Recipe Title"
                        //The beginning of "other" properties in [x: string]: any
                        type="text"
                        placeholder="Title"
                        //The end of "other" properties in [x: string]: any
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.title}
                    />

                    <TextInputField
                        rows={10}
                        name="text"
                        label="Text"
                        //The beginning of "other" properties in [x: string]: any
                        as="textarea"
                        row={5}
                        placeholder="Text"
                        //The end of "other" properties in [x: string]: any
                        register={register}
                    />

                    <FileInputField
                        name="image"
                        label="Upload Image"
                        setFile={setFile}
                    />

                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="addEditRecipeForm"
                    //We want to disable the button if form is currently being submitted
                    //so the user won't misclick twice
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddEditRecipeDialog;
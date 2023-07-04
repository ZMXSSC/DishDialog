import {Button, ButtonGroup, Form, Modal} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {Recipe} from "../models/recipe";
import {RecipeInput} from "../network/recipes_api";
import * as RecipesApi from "../network/recipes_api"
import TextInputField from "./form/TextInputField";
import FileInputField from "./form/FileInputField";
import {useEffect, useState} from "react";
import {User} from "../models/user";

interface AddEditRecipeDialogProps {
    loggedInUser?: User | null,
    recipeToEdit?: Recipe,
    onDismiss: () => void,
    onRecipeSaved: (recipe: Recipe) => void
}

//The Dialog(pop up window) that we design to create new recipe
const AddEditRecipeDialog = ({loggedInUser, recipeToEdit, onDismiss, onRecipeSaved}: AddEditRecipeDialogProps) => {

    //from react-hook-form
    //register is used to collect input from each input form
    //handleSubmit is used to collect all registers and pass it to a callback function(that could utilize these inputs)
    //errors is an object with field errors.(In this code we can access errors.title or errors.text to see if there's error


    //file is the file that the user select from the file dialog
    const [file, setFile] = useState<File | undefined>()

    const [isSharingLocation, setIsSharingLocation] = useState<boolean>(false);
    //isSubmitting return true if the form is currently being submitted. false otherwise.
    const [location, setLocation] = useState<{ latitude: string, longitude: string } | null>(null);

    const blurLocationRandomNumber = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = (position.coords.latitude + blurLocationRandomNumber(-0.3, 0.3)).toString();
                    const longitude = (position.coords.longitude + blurLocationRandomNumber(-0.3, 0.3)).toString();
                    setLocation({latitude, longitude});
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }


    useEffect(() => {
        if (isSharingLocation) {
            getLocation();
        }
    }, [isSharingLocation]);


    const {
        register, handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<RecipeInput>({
        defaultValues: {
            title: recipeToEdit?.title || "",
            text: recipeToEdit?.text || "",
            imageDesc: recipeToEdit?.imageDesc || "",
        }
    });


    async function Sub(input: RecipeInput) {
        try {
            let recipeResponse: Recipe;
            const formData = new FormData();
            if (!recipeToEdit) {
                formData.append("author", loggedInUser?.username || "");
            }
            formData.append("title", input.title);
            formData.append("text", input.text || "");

            formData.append("isPublic", input.isPublic || "");

            if (file) {
                formData.append("image", file);
            }
            formData.append("imageDesc", input.imageDesc || "");

            if (file) {
                formData.append("hasImage", "true");
            } else {
                if (recipeToEdit && recipeToEdit.hasImage) {
                    formData.append("hasImage", "true");
                } else {
                    formData.append("hasImage", "false");
                }
            }


            if (isSharingLocation) {
                formData.append("longitude", location?.longitude || "");
                formData.append("latitude", location?.latitude || "");
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

    const isPublic = recipeToEdit?.isPublic ? 'true' : 'false';

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
                        placeholder="Text"
                        //The end of "other" properties in [x: string]: any
                        register={register}
                    />

                    <FileInputField
                        name="image"
                        label="Upload Image(Lmit: 5MB)"
                        setFile={setFile}
                    />

                    <TextInputField
                        rows={2}
                        name="imageDesc"
                        label="Image Description"
                        //The beginning of "other" properties in [x: string]: any
                        as="textarea"
                        placeholder="Image Description"
                        //The end of "other" properties in [x: string]: any
                        register={register}
                    />
                    <Form.Check
                        {...register("isPublic", {required: true})}
                        type="radio"
                        label="Public"
                        value="true"
                        id="public"
                        defaultChecked={isPublic === "true"}
                    />

                    <Form.Check
                        {...register("isPublic", {required: true})}
                        type="radio"
                        label="Private"
                        value="false"
                        id="private"
                        defaultChecked={isPublic === "false"}
                    />
                </Form>
                <div style={{fontWeight: "bold"}}>
                    Want to share your location?(We won't show your exact location)
                </div>
                <ButtonGroup aria-label="Share location">
                    <Button variant={isSharingLocation ? "primary" : "secondary"}
                            onClick={() => setIsSharingLocation(true)}>
                        Yes
                    </Button>
                    <Button variant={!isSharingLocation ? "primary" : "secondary"}
                            onClick={() => setIsSharingLocation(false)}>
                        No
                    </Button>
                </ButtonGroup>

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
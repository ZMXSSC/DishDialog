import {User} from "../models/user";
import {Alert, Button, Form, Modal} from "react-bootstrap";
import {SignUpCredentials} from "../network/recipes_api";
import {useForm} from "react-hook-form";
import * as RecipesApi from "../network/recipes_api"
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css"
import {useState} from "react";
import {ConflictError} from "../errors/http_errors";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: User) => void,
}

const SignUpModal = ({onDismiss, onSignUpSuccessful}: SignUpModalProps) => {
    const[errorText, setErrorText] = useState<string | null>(null);

    const {register, handleSubmit,
        formState: {errors, isSubmitting}} = useForm<SignUpCredentials>();

    async function Sub(credentials: SignUpCredentials) {
        try {
            const newUser = await RecipesApi.signUp(credentials);
            onSignUpSuccessful(newUser);
        } catch (error) {
            if(error instanceof ConflictError) {
                setErrorText(error.message);
            }else{
                alert(error);
            }
            console.log(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Sign Up
                </Modal.Title>
            </Modal.Header>
            {errorText &&
                <Alert variant="danger">
                    {errorText}
                </Alert>
            }

            <Modal.Body>
                <Form onSubmit={handleSubmit(Sub)}>
                    <TextInputField
                    name = "username"
                    label = "Username"
                    type = "text"
                    placeholder="..type your username"
                    register={register}
                    registerOptions = {{required : "Required"}}
                    error={errors.username}
                    />

                    <TextInputField
                        name = "email"
                        label = "Email"
                        type = "email"
                        placeholder="..type your email address"
                        register={register}
                        registerOptions = {{required : "Required"}}
                        error={errors.email}
                    />

                    <TextInputField
                        name = "password"
                        label = "Password"
                        type = "password"
                        placeholder="..type your password"
                        register={register}
                        registerOptions = {{required : "Required"}}
                        error={errors.password}
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={styleUtils.width100}
                    >

                        Sign Up
                    </Button>
                </Form>
            </Modal.Body>

        </Modal>
    );
}

export default SignUpModal;
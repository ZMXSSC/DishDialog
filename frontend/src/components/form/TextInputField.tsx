import {Form} from "react-bootstrap";
import {FieldError, RegisterOptions, UseFormRegister} from "react-hook-form";

interface TextInputFieldProps {
    rows?: number,
    name: string,
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,

    //allow us to pass any other properties that's not listed above
    [x: string]: any,
}

const TextInputField = ({rows, name, label, register, registerOptions, error, ...props}: TextInputFieldProps) => {
    return (
        <Form.Group className="mb-3" controlId={name + "-input"}>
            <Form.Label>{label}</Form.Label>

            <Form.Control as = "textarea" rows={rows || 1}
                {...props}
                {...register(name, registerOptions)}
                //The !! convert errors.title to a boolean value. If there's an error then errors.title will
                //be converted to true which indicated the isInvalid is true.
                isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
        </Form.Group>
    );
}

export default TextInputField;
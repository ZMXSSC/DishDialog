import {Form} from "react-bootstrap";
import {FieldError} from "react-hook-form";
interface FileInputFieldProps {
    name: string,
    label: string,
    //We use setFile to set the file state because we want to set the file state when the user select a file
    setFile: React.Dispatch<React.SetStateAction<File | undefined>>,
    error?: FieldError,
}

const FileInputField = ({name, label, setFile, error}: FileInputFieldProps) => {

    //handleFileChange is a function that set the file state to the file that the user select from the file dialog
    //upon the onChange event triggered
    //e.target.files is an array of files that the user select from the file dialog
    //e.target.files[0] is the first file that the user select from the file dialog
    //e.target.files[0] is undefined if the user didn't select any file from the file dialog
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files ? e.target.files[0] : undefined);
    }

    return (
        <Form.Group className="mb-3" controlId={name + "-input"}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type="file"
                //We use onChange to set the file state because we want to set the file state when the user select a file
                //from the file dialog, not when the user submit the form
                //If we use register, the file state will only be set when the user submit the form
                //which will be too late
                onChange={handleFileChange}
                isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
        </Form.Group>
    );
}
export default FileInputField;

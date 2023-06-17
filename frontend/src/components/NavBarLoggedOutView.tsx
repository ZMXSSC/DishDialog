import {Button} from "react-bootstrap";

interface NavBarLoggedOutViewProps {
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
}

const NavBarLoggedOutView = ({onSignUpClicked, onLoginClicked}: NavBarLoggedOutViewProps) => {
    return (
        <>
            <Button className="me-2" variant="outline-dark" onClick={onSignUpClicked}>Sign Up</Button>
            <Button variant="outline-dark" onClick={onLoginClicked}>Log In</Button>
        </>
    );
}

export default NavBarLoggedOutView;
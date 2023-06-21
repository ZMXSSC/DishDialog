import {User} from "../models/user";
import {Container, Nav, Navbar} from "react-bootstrap";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import {Link} from "react-router-dom"
import style from "../styles/NavigationBar.module.css"

interface NavigationBarProps {
    //display the currently logged User, or if not logged in display the signup button
    loggedInUser: User | null;
    //Open the signUp modal upon clicking the sign-up button
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
    onLogoutSuccessful: () => void,
}


const NavigationBar = ({loggedInUser, onSignUpClicked, onLoginClicked, onLogoutSuccessful}: NavigationBarProps) => {
    return (
        <Navbar bg="light" variant="light" expand="lg" sticky="top" style={{borderBottom: '2px solid #000000'}}>
            <Container>
                <Navbar.Brand as={Link} to="/" className={style.brand}>
                    <span style={{ color: '#347e86' }}>D</span>ish
                    <span style={{ color: '#347e86' }}>D</span>ialog
                </Navbar.Brand>

                {/*If the user is logged in, we display the NavBarLoggedInView component, otherwise we display the*/}
                {/*aria-controls is used to identify the element that is controlled by the current element*/}
                <Navbar.Toggle aria-controls="navbar-nav"/>
                <Navbar.Collapse id="main-navbar">
                    <Nav>
                        {/*We are using Link from react-router-dom, but in terms of the styling we are using
                        Nav*/}
                        <Nav.Link as={Link} to="/community" className={style.pageName}>
                            Community
                        </Nav.Link>
                        <Nav.Link as={Link} to="/discover" className={style.pageName}>
                            Discover
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {loggedInUser
                            ? <NavBarLoggedInView user={loggedInUser} onLogoutSuccessful={onLogoutSuccessful}/>
                            : <NavBarLoggedOutView onLoginClicked={onLoginClicked} onSignUpClicked={onSignUpClicked}/>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
}

export default NavigationBar;
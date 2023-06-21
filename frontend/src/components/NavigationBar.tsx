import {User} from "../models/user";
import {Button, Col, Container, Form, FormControl, Nav, Navbar, Row} from "react-bootstrap";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import {Link, useNavigate} from "react-router-dom"
import style from "../styles/NavigationBar.module.css"
import React, {useState} from "react";

interface NavigationBarProps {
    //display the currently logged User, or if not logged in display the signup button
    loggedInUser: User | null;
    //Open the signUp modal upon clicking the sign-up button
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
    onLogoutSuccessful: () => void,
}


const NavigationBar = ({loggedInUser, onSignUpClicked, onLoginClicked, onLogoutSuccessful}: NavigationBarProps) => {
    const [term, setTerm] = useState('');
    //useNavigate is a hook that allows us to navigate to a different page
    const navigate = useNavigate();


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/search?term=${term}`);
    }
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
                    <Nav className="me-auto">
                        {/*We are using Link from react-router-dom, but in terms of the styling we are using
                        Nav*/}
                        <Nav.Link as={Link} to="/community" className={style.pageName}>
                            Community
                        </Nav.Link>
                        <Nav.Link as={Link} to="/discover" className={style.pageName}>
                            Discover
                        </Nav.Link>
                    </Nav>
                    <Form onSubmit={onSubmit} className="d-flex my-2 my-lg-0">
                        <Row style={{ width: '100%' }}>
                            <Col xs={9}>
                                <Form.Group>
                                    <FormControl type="search" placeholder="Search" aria-label="Search" value={term} onChange={(e) => setTerm(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group>
                                    <Button variant="outline-success" type="submit">Search</Button>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
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
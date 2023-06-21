import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal"
import NavigationBar from "./components/NavigationBar";
import {User} from "./models/user";
import {useEffect, useState} from "react";
import * as RecipesApi from "./network/recipes_api";
import RecipesPage from "./pages/RecipesPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Container} from "react-bootstrap";
import CommunityPage from "./pages/CommunityPage";
import NotFoundPage from "./pages/NotFoundPage";
import styles from "./styles/App.module.css"
import DiscoverPage from "./pages/DiscoverPage";


function App() {
    //loggedInUser is null if the user is not logged in, otherwise it is User object with the
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    //showSignUpModal is true if the sign up modal is visible, otherwise it is false
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    //showLoginModal is true if the login modal is visible, otherwise it is false
    const [showLoginModal, setShowLoginModal] = useState(false);

    //useEffect is a hook that allows us to perform side effects in function components
    //useEffect is being used to fetch the current user's details when the component first mounts.
    useEffect(() => {
        //fetchLoggedInUser is an async function that fetches the currently logged in user
        async function fetchLoggedInUser() {
            try {
                const user = await RecipesApi.getLoggedInUser();
                setLoggedInUser(user);
            } catch (error) {
                console.error(error);
            }
        }

        fetchLoggedInUser();
        //the empty array as the second argument to useEffect means that the effect will only run once
    }, []);
    return (
        <BrowserRouter>
            <div>
                <NavigationBar loggedInUser={loggedInUser}
                               onSignUpClicked={() => setShowSignUpModal(true)}
                               onLoginClicked={() => setShowLoginModal(true)}
                               onLogoutSuccessful={() => setLoggedInUser(null)}
                />
                <Container className={styles.pageContainer}>
                    <Routes>
                        <Route
                            path='/'
                            element={<RecipesPage loggedInUser={loggedInUser}/>}
                        />
                        <Route
                            path='/community'
                            element={<CommunityPage/>}
                        />
                        <Route
                            path='/discover'
                            element={<DiscoverPage/>}
                        />
                        <Route
                            path='/*'
                            element={<NotFoundPage/>}
                        />
                    </Routes>
                </Container>

                {showSignUpModal &&
                    <SignUpModal
                        onDismiss={() => setShowSignUpModal(false)}
                        onSignUpSuccessful={(user) => {
                            setLoggedInUser(user);
                            setShowSignUpModal(false);
                        }}
                    />
                }

                {showLoginModal &&
                    <LoginModal
                        onDismiss={() => setShowLoginModal(false)}
                        onLoginSuccessful={(user) => {
                            setLoggedInUser(user);
                            setShowLoginModal(false);
                        }}
                    />
                }
            </div>
        </BrowserRouter>
    );
}

export default App;

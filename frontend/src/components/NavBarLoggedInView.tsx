// import {Button, Navbar} from "react-bootstrap";
// import {User} from "../models/user"
// import * as RecipesApi from "../network/recipes_api"
//
// interface NavBarLoggedInViewProps {
//     user: User,
//     onLogoutSuccessful: () => void,
// }
//
// const NavBarLoggedInView = ({user, onLogoutSuccessful}: NavBarLoggedInViewProps) => {
//
//     async function logout() {
//         try {
//             await RecipesApi.logout();
//             onLogoutSuccessful();
//         } catch (error) {
//             alert(error);
//             console.log(error);
//         }
//     }
//
//     return (
//         <>
//             <Navbar.Text className="me-2">
//                 Signed in as: {user.username}
//             </Navbar.Text>
//
//             <Button onClick={logout}>Log out</Button>
//         </>
//     );
// }
//
// export default NavBarLoggedInView

import { Button, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import * as RecipesApi from "../network/recipes_api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessful: () => void,
}

const NavBarLoggedInView = ({ user, onLogoutSuccessful }: NavBarLoggedInViewProps) => {

    async function logout() {
        try {
            await RecipesApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            alert(error);
            console.log(error);
        }
    }

    return (
        <>
            <Navbar.Text className="me-3">
                <FontAwesomeIcon icon={faUser} /> Hi, {user.username}
            </Navbar.Text>

            <Button variant="outline-dark" onClick={logout}>Log out</Button>
        </>
    );
}

export default NavBarLoggedInView;

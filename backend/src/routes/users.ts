import * as UserController from "../controllers/userscontroller"
import express from "express";
import {requiresAuth} from "../middleware/auth";

const router = express.Router();

//Defining a route handler to get the current authenticated user(who still maintain the login status)
//We will use the requiresAuth middleware to ensure that the user is authenticated
//If they are, we will call the getAuthenticatedUser function
//If they are not, we will call the next middleware, which will be the error handler
//(requiresAuth) -> (getAuthenticatedUser) -> (error handler)
// |                                               |
// ---------------[if not auth]---------------------
router.get("/", requiresAuth, UserController.getAuthenticatedUser);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);
export default router;
import {RequestHandler} from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user"
import bcrypt from "bcrypt"

//Callback function to get the current login user
export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {

    try {
        //We will fetch the user id from the session, then we will find the user with that id
        const user = await UserModel.findById(req.session.userId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};


//We define an interface(customize type) of the request body
//We will ensure that the request body will have either undefined(if user did not input) or string type
interface SignUpBody {
    //We don't know if the user will provide these parameter in the endpoint so we need a "?"
    username?: string,
    email?: string,
    password?: string,
}

//Callback function to sign up for a user
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    //We will hash the original password
    const passwordRaw = req.body.password;

    try {
        //Check if either parameter is missing
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing")
        }

        //Determine if the username the user input already existed
        const existingUsername = await UserModel.findOne({username: username}).exec();

        //If it does exist, they can't create it
        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        //Determine if the email the user input already existed
        const existingEmail = await UserModel.findOne({email: email}).exec();

        //If it does exist, they can't create it
        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exist. Please log in instead.");
        }

        //We need to hash the raw password, with salt
        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        //Then we put the parameter altogether to create an account, store in the database
        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        });

        //We would like to store the id of the newUser
        //However Typescript doesn't know what the type of "userId" is, so we need to manually
        //create a new types declaration file, this file is in ./@types/session.d.ts

        //Also the reason to store the session for new user is they can maintain the login status immediately upon
        //signing up, so they don't need to re-sign up after creating their account.
        req.session.userId = newUser._id;

        //201 indicates HTTP code for a new resource created can also use 200(ok)
        res.status(201).json(newUser);

    } catch (error) {
        next(error);
    }
};

//We define an interface(customize type) of the request body
//We will ensure that the request body will have either undefined(if user did not input) or string type
interface LoginBody {
    username?: string,
    password?: string,
}

//Callback function to log in a user
export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        //Check if there's actually a user given the username(we also fetch their password and email explicitly since
        //by default we disabled the auto fetch in user.ts)
        const user = await UserModel.findOne({username: username}).select("+password +email").exec();

        //If we can't find the user associate with the username, we tell the user that the credential is invalid
        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }
        //Next we would like to compare the password the user input(unhashed) and the password from the database(hashed)
        //We utilized the bcrypt.compare function, and it will return a boolean to say whether they are match of not
        const passwordMatch = await bcrypt.compare(password, user.password);
        //If not match, then notify the user
        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials");
        }
        //We save the session base on their id, so they can maintain their log in status for a while after logging in
        req.session.userId = user._id;

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

//Callback function to log out a user
export const logout: RequestHandler = (req, res, next) => {
    //Destroy the session in the database, so no longer maintain login status.
    //Will be reflected in MongoDB as the session is deleted
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};
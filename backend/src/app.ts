import "dotenv/config";
import express, {NextFunction, Request, Response} from "express";
import recipesRoutes from "./routes/recipes";
import userRoutes from "./routes/users"
import * as RecipesController from "./controllers/recipescontroller";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session"
import env from "./util/validateEnv"
import MongoStore from "connect-mongo";
import {requiresAuth} from "./middleware/auth";

//Creating the Express server:
const app = express();

//morgan package for logging
app.use(morgan("dev"));

//We can get JSON from GET or send JSON from POST
//We need this line in order to have req.body... to work
app.use(express.json());

//Express session middleware is used to manage sessions in the app,
app.use(session({
    //Don't want to hardcode, so take it from the .env file
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        //Specify the maximum time before invalidate the session
        //In this case 60s * 60min * 1000ms = 1 hour
        maxAge: 60 * 60 * 1000,
    },
    //If the user do something in the website the timer will refresh
    rolling: true,
    //The place we store the session will be in MongoDB(then in MongoDB we shall see "sessions" in the collection)
    //Use external package "connect-mongo"
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    })
}))
app.use("/api/public-recipes", RecipesController.getPublicRecipes);
//Middleware catches any requests that goes to /api/users endpoint
//For the specific endpoint, it will be forwarded to the userRoutes
app.use("/api/users", userRoutes);

//If the user is authenticated, the middleware catches any requests that goes to /api/recipes endpoint,
//If the user is not authenticated, the middleware will throw an error
//For the specific endpoint, it will be forwarded to the recipesRoutes
app.use("/api/recipes", requiresAuth, recipesRoutes);

//Middleware, catch-all middleware
//will catch the request to "http://localhost:8080/rrr" because it acts as a catch-all middleware.
//Since it doesn't have a specific path pattern specified, it will be triggered for all requests that reach it.
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

//Error handler(Final Middleware)
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message
    }
    res.status(statusCode).json({error: errorMessage});

});
export default app;
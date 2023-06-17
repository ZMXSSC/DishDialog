import app from "./app"
import env from "./util/validateEnv"
import mongoose from "mongoose";


//We use env.PORT here over process.env.PORT because we need to ensure PORT exists in .env file
//To achieve this we will need a external package "Envalid". We set up a validateEnv.ts
//So then we can use env.PORT
const port = env.PORT;

mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose connected");
        app.listen(port, () => {
            console.log("Server running on port: " + port);
        });
    })
    .catch(console.error);


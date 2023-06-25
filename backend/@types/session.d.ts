import mongoose from "mongoose";

//we use this so that req.session.userId will be of type mongoose.Types.ObjectId
//and typescript will not complain about it
declare module "express-session" {
    interface SessionData {
        userId: mongoose.Types.ObjectId;
    }
}
import express from "express";
import { signup, Login, logout } from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", Login);
authRouter.post("/logout", logout);  

export default authRouter;

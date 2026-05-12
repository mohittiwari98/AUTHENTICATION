import express,{Router} from "express";
import {signup} from "../controllers/auth.controllers.js";
import {Login} from "../controllers/auth.controllers.js";
autRouter=express(Router());
authRouter.post("/signup",signup)
authRouter.post("/login",Login)
export default authRouter;
  

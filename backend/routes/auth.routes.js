import express,{Router} from "express";
import {signup} from "../controllers/auth.controllers.js":
autRouter=express(Router());
authRouter.post("/signup",signup)
export default authRouter;
  

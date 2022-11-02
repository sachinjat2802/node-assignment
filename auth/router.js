import { request, Router } from "express";
import { authController } from "./controller.js";
import {validateRegister,isLoggedIn} from "../middleware/Validation.js";
export const router = Router();

router.get("/ping", (req, res) => {
    res.send("pong")
})

router.post('/sign-up',validateRegister,authController.signup);
router.post('/login',authController.login);
router.get('/current-user',isLoggedIn,authController.currentUser);
router.get('/users',isLoggedIn,authController.users);
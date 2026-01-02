import express from "express";
import { registerUser, loginUser, loginRedirect, checkAuth, logoutUser, registerRedirect } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/login-redirect", loginRedirect);
router.get("/register-redirect", registerRedirect);
router.get("/check", checkAuth);
router.post("/logout", logoutUser);

export default router;

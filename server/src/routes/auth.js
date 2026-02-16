import express from "express";
import { registerUser, loginUser, logoutUser, checkAuth, googleLogin, getGoogleAuthConfig } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/google-config", getGoogleAuthConfig);

router.post("/logout", logoutUser);

router.get("/me", checkAuth);

export default router;

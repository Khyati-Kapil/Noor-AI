import express from "express";
import { registerUser, loginUser, loginRedirect, checkAuth, logoutUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/login-redirect", loginRedirect);
router.get("/check", checkAuth);
router.post("/logout", logoutUser);

export default router;

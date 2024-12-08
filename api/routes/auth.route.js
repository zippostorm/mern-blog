import express from "express";
import {
  google,
  signin,
  signup,
  verifyAuth,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/verify", verifyAuth);

export default router;

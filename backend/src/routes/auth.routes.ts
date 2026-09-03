import { Router } from "express";
import { register } from "../controllers/auth.controller";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello, Welcome")
})
router.post("/register", register);

export default router;

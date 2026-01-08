import { Router } from "express";
import userController from "../controllers/user.controller.js";
import validations from "../middlewares/validation.js";
const router = Router();

router.post("/registry", validations.register,  userController.registry);
router.post("/login", validations.login, userController.login);
router.get("/users", userController.getAllUsers)

export default router;
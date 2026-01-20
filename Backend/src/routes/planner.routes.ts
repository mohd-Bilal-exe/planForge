import { Router } from "express";
import { questionsController, planController } from "../controllers/planner.controller";
import { firebaseAuthMiddleware } from "../middlewares/firebaseAuth.middleware";

const router = Router();

// All planner routes require Firebase authentication
router.use(firebaseAuthMiddleware);

router.post("/questions", questionsController);
router.post("/plan", planController);

export default router;

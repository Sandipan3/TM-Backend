// routes/taskRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/taskControllers.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllTasks);
router.post("/", createTask);
router.put("/:title", updateTask);
router.delete("/:title", deleteTask);

export default router;

import { Router } from "express";
import {
  listTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import { createTodoSchema, updateTodoSchema, todoIdParamSchema } from "../security/validators.js";
import { validateRequest } from "../security/validateRequest.js";
import { createRouteRateLimiterFromEnv } from "../security/rateLimiter.js";

const router = Router();

const createTodoLimiter = createRouteRateLimiterFromEnv("RATE_LIMIT_CREATE_TODO", {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // create requests per IP per window
});

const mutationLimiter = createRouteRateLimiterFromEnv("RATE_LIMIT_MUTATION", {
  windowMs: 15 * 60 * 1000,
  max: 50, // updates/deletes per IP per window
});

router.get("/", listTodos);
router.post("/", createTodoLimiter, validateRequest(createTodoSchema), createTodo);
router.put(
  "/:id",
  mutationLimiter,
  validateRequest(todoIdParamSchema, "params"),
  validateRequest(updateTodoSchema),
  updateTodo,
);
router.delete(
  "/:id",
  mutationLimiter,
  validateRequest(todoIdParamSchema, "params"),
  deleteTodo,
);

export default router;

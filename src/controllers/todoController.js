import {
  getTodos,
  createTodo as createTodoService,
  updateTodo as updateTodoService,
  deleteTodo as deleteTodoService,
} from "../services/todoService.js";

export const listTodos = async (req, res) => {
  const todos = await getTodos();
  res.json(todos);
};

export const createTodo = async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "title is required" });
  }

  const todo = await createTodoService(title);
  res.status(201).json(todo);
};

export const updateTodo = async (req, res) => {
  const id = Number(req.params.id);
  const { title, completed } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "invalid id" });
  }

  const data = {};
  if (title !== undefined) {
    if (typeof title !== "string") {
      return res.status(400).json({ error: "title must be a string" });
    }
    data.title = title.trim();
  }
  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "completed must be a boolean" });
    }
    data.completed = completed;
  }

  try {
    const todo = await updateTodoService(id, data);
    res.json(todo);
  } catch (error) {
    res.status(404).json({ error: "Todo not found" });
  }
};

export const deleteTodo = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "invalid id" });
  }

  try {
    await deleteTodoService(id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Todo not found" });
  }
};

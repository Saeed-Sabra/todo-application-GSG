import { Router } from "express";
import { body, param, query } from "express-validator";
import createHttpError from "http-errors";
import { validateResultMiddleware } from "./validateResultMiddleware.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const tasksRouter = Router();

let tasks = [];
let lastIndex = 0;

tasksRouter.post(
  "",
  [
    body("name").exists().isString(),
    body("priority").exists().isInt({ min: 1, max: 5 }),
    body("userId").exists().isInt().toInt(),
  ],
  validateResultMiddleware,
  async (req, res) => {
    const { name, priority, userId } = req.body;

    // Create a new task object
    const newTask = {
      name,
      priority,
      userId
    };

    const createdTask = await prisma.task.create({
      data: newTask,
    });
    res.status(201).json(createdTask);
  }
);

// PUT /tasks/:id endpoint
tasksRouter.put(
  "/:id",
  [
    param("id").isInt().toInt(),
    body("name").exists().isString(),
    body("priority").exists().isInt({ min: 1, max: 5 }),
  ],
  validateResultMiddleware,
  async (req, res) => {
    const taskId = req.params.id;
    const { name, priority } = req.body;

    const taskToUpdate = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        name,
        priority,
      },
    });
    res.status(200).json(taskToUpdate);
  }
);

// GET /tasks endpoint
tasksRouter.get(
  "",
  [query("priority").optional().isInt().toInt()],
  validateResultMiddleware,
  async (req, res) => {
    const filters = req.query;

    const tasks = await prisma.task.findMany({
      where: filters,
    });
    res.json(tasks);
  }
);

// GET /tasks/:id endpoint
tasksRouter.get("/:id", async (req, res) => {
  const taskId = parseInt(req.params.id);

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
    },
  });
  if (!task) {
    throw createHttpError.NotFound("Task not found");
  }

  res.json(task);
});

// DELETE /tasks/:id endpoint
tasksRouter.delete("/:id", async (req, res) => {
  const taskId = parseInt(req.params.id);

  // Remove the task from the tasks array
  const deletedTask = await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  res.json(deletedTask);
});

export default tasksRouter;

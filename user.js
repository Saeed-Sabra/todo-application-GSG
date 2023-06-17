import { Router } from "express";
import { body, param, query } from "express-validator";
import createHttpError from "http-errors";
import { validateResultMiddleware } from "./validateResultMiddleware.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
// const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const userRouter = Router();

userRouter.post(
  "",
  [body("name").exists().isString(), body("password").exists().isString()],
  validateResultMiddleware,
  async (req, res) => {
    const { name, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,   
      },
    });

    res.status(201).json(newUser);
  }
);

// PUT /tasks/:id endpoint
userRouter.put(
  "/:id",
  [
    param("id").isInt().toInt(),
    body("name").exists().isString(),
    body("password").exists().isString(),
  ],
  validateResultMiddleware,
  async (req, res) => {
    const userId = req.params.id;
    const { name, password } = req.body;

    const userToUpdate = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        password,
      },
    });
    res.status(200).json(userToUpdate);
  }
);

userRouter.get("", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// GET /tasks endpoint
// userRouter.get(
//   "",
//   [query("priority").optional().isInt().toInt()],
//   validateResultMiddleware,
//   async (req, res) => {
//     const filters = req.query;

//     const tasks = await prisma.user.findMany({
//       where: filters,
//     });
//     res.json(tasks);
//   }
// );

// GET /tasks/:id endpoint
userRouter.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw createHttpError.NotFound("User not found");
  }

  res.json(user);
});

// DELETE /tasks/:id endpoint
userRouter.delete("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  // Remove the user from the tasks array
  const deletedUser = await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  res.json(deletedUser);
});

export default userRouter;

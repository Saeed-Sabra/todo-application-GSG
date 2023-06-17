import express from "express";
import tasksRouter from "./routers/tasks.js";
import userRouter from "./routers/user.js";
import { authenticationMiddleware } from "./auth.js";

const app = express();
app.use(express.json());

app.use("/tasks", authenticationMiddleware, tasksRouter);
app.use("/users", userRouter);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode;
  res.status(statusCode).send({
    status: false,
    msg: error.message,
    stack: error.stack,
    statusCode,
  });
});

app.listen(3000, () => {
  console.log("server started");
});

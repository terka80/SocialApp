import { bootstrapDB } from "./DB/connection.db";
import { ORIGINS, PORT } from "./config";
import { globalErrorHandling } from "./middleware/error.middleware";
import express from "express";
import {
  authenticationController,
  commentController,
  postController,
  userController,
} from "./modules";
import cors from "cors";
const app: express.Application = express();

var corsOptions = {
  origin: function (origin: string, callback: Function) {
    if (!ORIGINS.includes(origin)) {
      callback(
        new Error("Unauthorized origin ", { cause: { status: 401 } }),
        ORIGINS,
      );
    } else {
      callback(null, ORIGINS);
    }
  },
};

app.use(cors(), express.json());
app.use("/assets", express.static("./assets"));

bootstrapDB(app, PORT);
app.all(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<express.Response> => {
    return res.status(200).json({ message: "done request" });
  },
);
app.use("/auth", authenticationController);
app.use("/user", userController);
app.use("/post", postController);
app.use("/comment", commentController);

app.use(globalErrorHandling);

import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import { userRouter, videoRouter } from "./routes/index.routes.js";
import fs from "fs";
import path from "path";
dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(userRouter);
app.use(videoRouter);

app.use((err, req, res, next) => {
  if (err) {
    if (+err.status < 500) {
      return res.status(err.status).json({
        status: err.status,
        message: err.message,
      });
    } else {
      fs.appendFileSync(
        path.join("src", "logs", "errors.log"),
        `[${new Date().toISOString()}] | [ERROR] |  ${err.status || 500} ${
          err.message
        } | ${err.stack}\n`
      );
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }
});

app.listen(PORT, () => console.log(`Server is runned on ${PORT}`));

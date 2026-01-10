import { Router } from "express";
import videoController from "../controllers/video.controller.js";
import validations from "../middlewares/validation.js";
import checkToken from "../middlewares/checkToken.js";
const router = Router();

router
  .post("/video", validations.validateVideo, videoController.uploadVideo)
  .delete("/video/:id", videoController.deleteVideo)
  .put("/video/:id", validations.validateVideo, videoController.updateVideo)
  .get("/video/oneUser",checkToken , videoController.getVideoById)
  .get("/files", videoController.getAllVideos);

export default router;

import { Router } from "express";
import videoController from "../controllers/video.controller.js";
import validations from "../middlewares/validation.js";
const router = Router();

console.log("route");

router
  .post("/video", validations.validateVideo, videoController.uploadVideo)
  .delete("/video/:id", videoController.deleteVideo)
  .put("/video/:id", validations.validateVideo, videoController.updateVideo)
  .get("/files", videoController.getAllVideos);

export default router;

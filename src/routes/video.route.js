import { Router } from "express";
const router = Router();

router.post("/videos", (req, res) => {
  res.send("Welcome to the Video Page");
});

export default router;
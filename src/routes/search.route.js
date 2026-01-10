import { Router } from "express";
import pool from "../databases/config.js";

const router = Router();

router.get("/search", async (req, res) => {
  let { search } = req.query;

  const videosData = await pool.query(`SELECT title FROM videos WHERE title ILIKE '%' || $1 || '%'`,[search]);
  const usersData = await pool.query(`SELECT full_name FROM users WHERE full_name ILIKE '%' || $1 || '%'`,[search]);

  res.json({ videos: videosData.rows, users: usersData.rows });
});

export default router;
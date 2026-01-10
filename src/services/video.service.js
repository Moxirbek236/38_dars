import pool from "../databases/config.js";
import path, { extname } from "path";
import {
  InternalServerError,
  ConflictError,
  NotFoundError,
} from "../utils/errors.js";

class VideoService {
  constructor() {}

  async uploadVideo(body, file) {
    const { title, user_id } = body;

    const videoPath = path.join(
      "src",
      "uploads",
      `${(Date.now() * 1000) / 10}${extname(file.name)}`
    );
    await file.mv(videoPath, (err) => {
      if (err) {
        throw new InternalServerError(500, err);
      }
    });
    const newVideo = await pool.query(
      "INSERT INTO videos (title, user_id, avatar_url) VALUES ($1, $2, $3) RETURNING *",
      [title, user_id, videoPath]
    );
    return {
      status: 201,
      message: "Video uploaded successfully",
      data: newVideo.rows[0],
    };
  }
  async deleteVideo(id) {
    if (!id) {
      throw new NotFoundError(404, "Video ID is required");
    }

    const deletedVideo = await pool.query(
      "DELETE FROM videos WHERE id = $1 RETURNING *",
      [id]
    );
    return {
      status: 200,
      message: "Video deleted successfully",
      data: deletedVideo.rows[0],
    };
  }
  async getAllVideos() {
    const videos = (await pool.query("SELECT * FROM videos")).rows;
    return {
      status: 200,
      message: "Query OK",
      data: videos,
    };
  }
  async updateVideo(id, body, files) {

    if (!id) {
      throw new NotFoundError(404, "Video ID is required");
    }

    const { title, user_id } = body;

    const { avatar_url } = files;
    const videoPath = path.join(
      "src",
      "uploads",
      `${(Date.now() * 1000) / 10}${extname(avatar_url.name)}`
    );
    await avatar_url.mv(videoPath);

    const updatedVideo = await pool.query(
      "UPDATE videos SET title = $1, avatar_url = $2, user_id = $3 WHERE id = $4 RETURNING *",
      [title, videoPath, user_id, id]
    );
    return {
      status: 200,
      message: "Video updated successfully",
      data: updatedVideo.rows[0],
    };
  }

    async getVideoById(user_id) {
        const video = await pool.query(
            "SELECT * FROM videos WHERE user_id = $1",
            [user_id]
        );
        return {
            status: 200,
            message: "Query OK",
            data: video.rows,
        };
    }
}

export default new VideoService();

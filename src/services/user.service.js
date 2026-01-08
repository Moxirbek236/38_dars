import pool from "../databases/config.js";
import path from "path";

class UserService {
  constructor() {}

  async registry(body, file) {
    const { username, password } = body;
    console.log(file);

    const avatarPath = path.join(
      "src",
      "uploads",
      `${(Date.now() * 1000) / 0.9}`
    );

    await file.mv(avatarPath);
    const newUser = await pool.query(
      "INSERT INTO users (full_name, password, avatar_url) VALUES ($1, $2, $3) RETURNING *",
      [username, password, avatarPath]
    );

    return newUser.rows[0];
  }
  async login(credentials) {
    const { username, password } = credentials;
    const user = await pool.query(
      "SELECT * FROM users WHERE full_name = $1 AND password = $2",
      [username, password]
    );

    if (user.rows.length === 0) {
      throw new Error("Invalid username or password");
    }

    return user.rows[0];
  }
  async getAllUsers() {
    try {
      const users = (await pool.query("SELECT * FROM users")).rows;
      return {
        status: 200,
        message: "Query OK",
        data: users,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export default new UserService();

import pool from "../databases/config.js";
import path from "path";
import { hash_password, compare_password } from "../utils/bcrypt.js";
import jwt from "../utils/jwt.js";
import {
  InternalServerError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors.js";

class UserService {
  constructor() {}

  async registry(body, file) {
    const { full_name, password } = body;

    const users = await pool.query("SELECT * FROM users WHERE full_name = $1", [
      full_name,
    ]);

    console.log(users);

    if (users.rowCount > 0) {
      throw new ConflictError("User already exists", 409);
    }

    const hashedPassword = await hash_password(password);

    const phoroPath = path.join(
      "src",
      "uploads",
      `${(Date.now() * 1000) / 0.9}`
    );

    const accesToken = jwt.generateToken({ full_name, phoroPath, id: users.rows[0].id });

    const newUser = await pool.query(
      "INSERT INTO users (full_name, avatar_url, password) VALUES ($1, $2, $3) RETURNING *",
      [full_name, phoroPath, hashedPassword]
    );

    newUser.rows[0].accessToken = accesToken;

    file.mv(phoroPath, (err) => {
      if (err) {
        throw new InternalServerError(500, err);
      }
    });

    return {
      status: 201,
      message: "User registered successfully",
      data: newUser.rows[0],
    };
  }

  async login(body) {
    console.log("service");
    
    const { full_name, password } = body;

    const user = await pool.query("SELECT * FROM users WHERE full_name = $1", [
      full_name,
    ]);

    if (user.rows.length === 0) {
      throw new NotFoundError("User not found", 404);
    }

    const isPasswordValid = await compare_password(
      password,
      user.rows[0].password
    );

    const accessToken = jwt.generateToken({ full_name, avatar_url: user.rows[0].avatar_url, id: user.rows[0].id });

    user.rows[0].accessToken = accessToken;

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid password", 401);
    }
    
    return {
      status: 200,
      message: "Login successful",
      data: user.rows[0],
    };
  }

  async getAllUsers() {
    const users = (await pool.query("SELECT * FROM users")).rows;

    if (!users.length) {
      throw new NotFoundError("No users found", 404);
    }

    return {
      status: 200,
      message: "Query OK",
      data: users,
    };
  }

  async updateUser(id, body, file) {
    if (!id) {
      throw new NotFoundError(404, "User ID is required");
    }

    const { full_name, password } = body;

    const hashedPassword = await hash_password(password);

    let phoroPath;
    if (file) {
      phoroPath = path.join(
        "src",
        "uploads",
        `${(Date.now() * 1000) / 0.9}`
      );

      file.mv(phoroPath, (err) => {
        if (err) {
          throw new InternalServerError(500, err);
        }
      });
    }

    const updatedUser = await pool.query(
      "UPDATE users SET full_name = $1, password = $2, avatar_url = COALESCE($3, avatar_url) WHERE id = $4 RETURNING *",
      [full_name, hashedPassword, phoroPath, id]
    );

    return {
      status: 200,
      message: "User updated successfully",
      data: updatedUser.rows[0],
    };
  }
}

export default new UserService();

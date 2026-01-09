import pool from "../databases/config.js";
import path from "path";
import { hash_password, compare_password } from "../utils/bcrypt.js";
import jwt from "../utils/jwt.js";

class UserService {
  constructor() {}
  
  
  async registry(body) {
    const { full_name, avatar_url, password } = body;

    const users = await pool.query(
      "SELECT * FROM users WHERE full_name = $1",
      [full_name]
    );

    if (users.rows.length > 0) {
      return {
        status: 409,
        message: "User already exists",
      };
    }

    
    const hashedPassword = await hash_password(password);
    
    const phoroPath = path.join(
      "src",
      "uploads",
      `${(Date.now() * 1000) / 0.9}`
    );
    
    const accesToken = jwt.generateToken({ full_name, phoroPath });

    const newUser = await pool.query(
      "INSERT INTO users (full_name, avatar_url, password) VALUES ($1, $2, $3) RETURNING *",
      [full_name, phoroPath, hashedPassword]
    );

    newUser.rows[0].accessToken = accesToken;

    return {
      status: 201,
      message: "User registered successfully",
      data: newUser.rows[0],
    };
  }

  async login(body) {
    const { full_name, password } = body;

    const user = await pool.query(
      "SELECT * FROM users WHERE full_name = $1",
      [full_name]
    );

    if (user.rows.length === 0) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    const isPasswordValid = await compare_password(password, user.rows[0].password);
    
    if (!isPasswordValid) {
      return {
        status: 401,
        message: "Invalid password",
      };
    }

    return {
      status: 200,
      message: "Login successful",
      data: {full_name: user.rows[0].full_name, avatar_url: user.rows[0].avatar_url},
    }; 
  }

  async getAllUsers() {
    const users = (await pool.query("SELECT * FROM users")).rows;
    return {
      status: 200,
      message: "Query OK",
      data: users,
    };
  }
}

export default new UserService();

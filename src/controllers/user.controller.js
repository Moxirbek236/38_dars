import userService from "../services/user.service.js";

class UserController {
  constructor() {}
  async registry(req, res, next) {
    try {
      const data = await userService.registry(req.body, req.files.file);
      res.status(201).json({
        status: 201,
        message: "User registered successfully",
        data: data,
      });
    } catch (err) {
      err.status = 409;
      res.status(err.status).json({
        status: 409,
        message: err.detail,
      });
    }
  }

  async login(req, res) {
    const data = await userService.login(req.body);

    res.status(200).json({
      status: 200,
      message: "User logged in successfully",
      data: data,
    });
  }

  async getAllUsers(req, res) {
    const data = await userService.getAllUsers();

    res.status(data.status).json(data);
  }
}

export default new UserController();

import { UnauthorizedError } from "../utils/errors.js";
import jwt from "../utils/jwt.js";
import {TokenExpried, JsonWebTokenError} from "../utils/errors.js";

export default (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      throw new UnauthorizedError("No token provided", 401);
    }

    const decoded = jwt.verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
        next(new TokenExpried("Token has expired", 401));
    } else if (error.name === "JsonWebTokenError") {
        next(new JsonWebTokenError("Invalid token", 401));
    } else {
        next(error);}
  }
};

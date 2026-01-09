import JWT from "jsonwebtoken";

class JWTService {
  generateToken(payload) {
    return JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  }
    verifyToken(token) {
    return JWT.verify(token, process.env.JWT_SECRET);
  }
}

export default new JWTService();
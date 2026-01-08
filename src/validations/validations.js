import Joi from "joi";

class Validations {
  userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).max(20).required(),
  });
}

export default new Validations();

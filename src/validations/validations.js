import Joi from "joi";

class Validations {
  userSchema = Joi.object({
    full_name: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).max(20).required(),
  });

  videoSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    user_id: Joi.number().required(),
  });
}

export default new Validations();

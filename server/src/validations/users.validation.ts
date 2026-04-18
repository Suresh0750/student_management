import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(18).required()
});

const data = {
  name: "Suresh",
  email: "test@gmail.com",
  age: 23
};

const { error, value } = userSchema.validate(data);

if (error) {
  console.log(error.details[0].message);
} else {
  console.log("Valid data:", value);
}
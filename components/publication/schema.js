const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const id = Joi.objectId();
const text = Joi.string().min(1);
const file = Joi.any();

const getPublicationSchema = Joi.object({
  id: id.required(),
});

const createPublicationSchema = Joi.object({
  text: text.required(),
});

const updatePublicationSchema = Joi.object({
  text,
  file,
});

module.exports = {
  getPublicationSchema,
  createPublicationSchema,
  updatePublicationSchema,
};

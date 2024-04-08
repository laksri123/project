const Joi = require("joi");

module.exports.listingSchema= Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    image: Joi.object({
        filename: Joi.string(),
        url: Joi.string().allow("",null),
    }),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    gst: Joi.number().required(),
    category: Joi.string().required(),
}).required();

module.exports.reviewSchema= Joi.object({
    review: Joi.object({
         comment: Joi.string().required(),
         rating: Joi.number().required().max(5).min(1),
    }).required()
}).required();

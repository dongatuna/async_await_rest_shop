const Joi = require('joi');

module.exports = {   

    validateBody: (schema)=>{
        return(req, res, next)=>{
            const result = Joi.validate(req.body, schema);

            if(result.error){
                return res.status(400).json(result.error);
            }
            //if the req.value is null, set it to an empty object
            if(!req.value){req.value = {};}

            req.value["body"] = result.value;

            console.log(req.value['body']);
            next();
        }
    },

    schemas:{
        userSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),

        productSchema: Joi.object().keys({
            name: Joi.string().required(),
            price: Joi.number().required(),
            //productImage: Joi.string().required()
        }),

        orderSchema: Joi.object().keys({
            //product: Joi.object({productSchema}).required(),
            product: Joi.string().required(),
            quantity: Joi.number()
            
        })

    }

}
    



//module.exports = {validateBody, schemas};
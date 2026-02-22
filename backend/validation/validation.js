import joi from 'joi';

export const newUsersValidation = (data) => {
    const schema = joi.object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string()
            .min(6)
            .pattern(new RegExp('(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])'))
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least one uppercase letter, one number and one special character',
                'string.min': 'Password must be at least 6 characters long'
            })
    });

    return schema.validate(data, { abortEarly: false });
}

export const loginValidation = (data) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string()
            .min(6)
            .pattern(new RegExp('(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])'))
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least one uppercase letter, one number and one special character',
                'string.min': 'Password must be at least 6 characters long'
            })
    });

    return schema.validate(data, { abortEarly: false });
}
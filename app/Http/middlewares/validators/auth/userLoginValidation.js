import { body, param, validationResult } from 'express-validator';

export default [
    body('email')
        .notEmpty().withMessage("Email is required").bail()
        .isEmail().withMessage('Email must be a valid email address'),
    body('password')
        .notEmpty().withMessage("Password is required").bail()
        .isString().withMessage('Password must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(419).json({ errors: errors.array() });
        }
        next();
    },
];

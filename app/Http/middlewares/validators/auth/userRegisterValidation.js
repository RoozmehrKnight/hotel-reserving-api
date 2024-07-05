import { body, param, validationResult } from 'express-validator';

export default [
    body('name')
        .notEmpty().withMessage("Name is required").bail()
        .isString().withMessage('Name must be a string'),
    body('email')
        .notEmpty().withMessage("Email is required").bail()
        .isEmail().withMessage('Email must be a valid email address'),
    body('password')
        .notEmpty().withMessage("Password is required").bail()
        .isString().withMessage('Password must be a string'),
    body('password_confirmation')
        .notEmpty().withMessage('Password confirmation is required').bail()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(419).json({ errors: errors.array() });
        }
        next();
    },
];

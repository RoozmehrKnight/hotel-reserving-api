import { body, validationResult } from 'express-validator';

export default [
    body('title')
        .notEmpty().withMessage("Title is required").bail()
        .isString().withMessage('Title must be a string'),
    body('slug')
        .optional()
        .isString().withMessage('Slug must be a string'),
    body('kind')
        .notEmpty().withMessage("Kind is required").bail()
        .isString().withMessage('Kind must be a string'),
    body('description')
        .notEmpty().withMessage("Description is required").bail()
        .isString().withMessage('Description must be a string'),
    body('price')
        .notEmpty().withMessage("Price is required").bail()
        .isNumeric().withMessage('Price must be a number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(419).json({ errors: errors.array() });
        }
        next();
    },
];

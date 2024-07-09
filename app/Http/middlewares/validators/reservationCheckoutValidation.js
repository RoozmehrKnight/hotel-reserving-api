import { body, param, validationResult } from 'express-validator';

export default [
    body('productId')
        .notEmpty().withMessage("productId is required").bail()
        .isString().withMessage('productId must be a string'),
    body('startDate')
        .notEmpty().withMessage("startDate is required").bail()
        .isNumeric().withMessage('productId must be a number'),
    body('endDate')
        .notEmpty().withMessage("endDate is required").bail()
        .isNumeric().withMessage('productId must be a number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(419).json({ errors: errors.array() });
        }
        next();
    },
];

import { body, param, validationResult } from 'express-validator';

export default [
    body('title')
        .optional()
        .isString().withMessage('Title must be a string'),
    body('priceRange.startPrice')
        .optional()
        .isNumeric().withMessage('StartPrice must be a number'),
    body('priceRange.endPrice')
        .optional()
        .isNumeric().withMessage('EndPrice must be a number'),
    body('dateRange.startDate')
        .optional()
        .isNumeric().withMessage('StartDate must be a number'),
    body('dateRange.endDate')
        .optional()
        .isNumeric().withMessage('EndDate must be a number'),
    body('kind')
        .optional()
        .isString().withMessage('Kind must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(419).json({ errors: errors.array() });
        }
        next();
    },
];

import express from "express";
import AuthController from "../app/Http/controllers/AuthController.js";
import userLoginValidator from "../app/Http/middlewares/validators/auth/userLoginValidation.js"
import userRegisterValidation from "../app/Http/middlewares/validators/auth/userRegisterValidation.js"
import ProductSingleController from "../app/Http/controllers/ProductSingleController.js";
import ifAuthenticated from "../app/Http/middlewares/ifAuthenticated.js";
import isAuthenticated from "../app/Http/middlewares/isAuthenticated.js";
import ReservationController from "../app/Http/controllers/ReservationController.js";
import reservationCheckoutValidation from "../app/Http/middlewares/validators/reservationCheckoutValidation.js";

const router = express.Router()

router.get('/', (req, res) => {
    res.send('client page')
});

//auth
router.post('/auth/login', userLoginValidator, AuthController.login);
router.post('/auth/register', userRegisterValidation, AuthController.register);

router.get('/products/:slug', ifAuthenticated, ProductSingleController.show);

// payment system
router.post('/reservations/checkout', isAuthenticated, reservationCheckoutValidation, ReservationController.checkout);
router.get('/reservations/callback', ReservationController.callback);

export default router;

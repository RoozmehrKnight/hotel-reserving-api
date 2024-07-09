import express from "express";
import AuthController from "../app/Http/controllers/AuthController.js";
import userLoginValidator from "../app/Http/middlewares/validators/auth/userLoginValidation.js"
import userRegisterValidation from "../app/Http/middlewares/validators/auth/userRegisterValidation.js"
import ProductSingleController from "../app/Http/controllers/ProductSingleController.js";
import ifAuthenticated from "../app/Http/middlewares/ifAuthenticated.js";

const router = express.Router()

router.get('/', (req, res) => {
    res.send('client page')
});

//auth
router.post('/auth/login', userLoginValidator, AuthController.login);
router.post('/auth/register', userRegisterValidation, AuthController.register);

router.get('/products/:slug', ifAuthenticated, ProductSingleController.show)

export default router;

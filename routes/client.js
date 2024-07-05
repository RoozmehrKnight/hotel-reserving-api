import express from "express";
import AuthController from "../app/Http/controllers/AuthController.js";
import userLoginValidator from "../app/Http/middlewares/validators/auth/userLoginValidation.js"
import userRegisterValidation from "../app/Http/middlewares/validators/auth/userRegisterValidation.js"

const router = express.Router()

router.get('/', (req, res) => {
    res.send('client page')
});

//auth
router.post('/auth/login', userLoginValidator, AuthController.login);
router.post('/auth/register', userRegisterValidation, AuthController.register);


export default router;

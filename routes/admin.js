import express from "express";
import isAdmin from "../app/Http/middlewares/isAdmin.js";
import ProductsController from "../app/Http/controllers/admin/ProductsController.js";
import UsersController from "../app/Http/controllers/admin/UsersController.js";
import productStoreValidation from "../app/Http/middlewares/validators/admin/products/productStoreValidation.js";
import UserRegisterValidation from "../app/Http/middlewares/validators/auth/userRegisterValidation.js";
import UserUpdateValidation from "../app/Http/middlewares/validators/admin/users/userUpdateValidation.js";
import multer from "multer";

const router = express.Router()
// configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})
const upload = multer({ storage: storage })

router.use(isAdmin);


// define the home page route
router.get('/', (req, res) => {
    res.send('admin page')
});

// products crud
router.get('/products', ProductsController.index);
router.post('/products', upload.single('file'), productStoreValidation, ProductsController.store);
router.get('/products/:id', ProductsController.show);
router.put('/products/:id', productStoreValidation, ProductsController.update);
router.delete('/products/:id', ProductsController.delete);

// users crud
router.get('/users', UsersController.index);
router.post('/users', UserRegisterValidation, UsersController.store);
router.get('/users/:id', UsersController.show);
router.put('/users/:id', UserUpdateValidation, UsersController.update);
router.delete('/users/:id', UsersController.delete);

export default router;
import bcrypt from "bcrypt";
import User from "../../Models/User.js";
import jwt from "jsonwebtoken";

class AuthController {

    async login (req, res){
        const user = await User.findOne({email: req.body.email});

        if (user && await bcrypt.compare(req.body.password, user.password)){
            res.status(200).json({
                token: generateToken(user),
                msg: 'user logged in successfully',
            });
        }else{
            res.status(401).json({
                msg: 'invalid credentials'
            });
        }
    }

    async register (req, res){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })

        res.status(201).json({
            token: generateToken(user),
            msg: 'user registered successfully',
        })
    }
}

function generateToken(user){
    return jwt.sign({
        id: user._id,
        name: user.name,
        iat: Date.now(),
        isAdmin: user.isAdmin,
    }, process.env.JWT_TOKEN_SECRET);
}

export default new AuthController();
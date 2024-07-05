import jwt from "jsonwebtoken";
import User from "../../Models/User.js";
import {Mongoose} from "mongoose";

export default async function (req, res, next){
    const authHeader = req.headers['authorization'] ?? '';
    const token = authHeader.split(' ')[1];

    if (!token) res.sendStatus(401);

    jwt.verify(token, process.env.JWT_TOKEN_SECRET, async (err, user)=>{
        if (err || !user.isAdmin) return res.sendStatus(403);

        req.user = await User.findOne({_id: user.id});
        next();
    })
}
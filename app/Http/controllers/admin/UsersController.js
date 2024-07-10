import User from "../../../Models/User.js";
import bcrypt from "bcrypt";
import Reservation from "../../../Models/Reservation.js";

class UserController {
    pageResultCount = 12;

    constructor() {
        this.index = this.index.bind(this); // this line allows the index() method to access "this"
    }

    async index(req, res){
        const skip = (req.query.page - 1) * this.pageResultCount;
        const users = await User.find().skip(skip).limit(this.pageResultCount).exec();
        const total = await User.countDocuments();

        res.status(200).json({
            users,
            totalPages: Math.ceil(total / this.pageResultCount),
            currentPage: req.query.page,
        });
    }

    async store(req, res){
        const salt = await bcrypt.genSalt(10);

        const data = {
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
        };

        await User.create(data); // code and slug are generated in pre() event

        res.status(201).json({
            msg: "user created successfully"
        });
    }

    async show(req, res){
        const user = await User.findOne({_id: req.params.id});
        const reservations = await Reservation.aggregate([
            {
                $match: {userId: user._id}
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
        ]);

        if (user){
            return res.status(200).json({
                'user': user,
                'reservations': reservations,
            });
        }

        res.status(404).json({ msg: 'User not found' });
    }

    async update(req, res){
        const data = {
            name: req.body.name,
            email: req.body.email,
        };

        if (req.body.password){
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(req.body.password, salt);
        }

        const result = await User.updateOne(
            {_id: req.params.id},
            data,
            { runValidators: true }
        );

        if (result.matchedCount === 1 && result.modifiedCount === 1) {
            return res.status(200).json({ msg: "User updated successfully" });
        }else if (result.matchedCount === 1){
            return res.status(200).json({ msg: "No change to user detected" });
        }

        res.status(404).json({ msg: 'User not found' });
    }

    async delete(req, res){
        const result = await User.deleteOne({_id: req.params.id});

        if (result.deletedCount === 1){
            return res.status(200).json({ msg: "User deleted successfully" });
        }

        res.status(404).json({ msg: 'User not found' });
    }
}

export default new UserController();
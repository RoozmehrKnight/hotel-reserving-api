import Product from "../../../Models/Product.js";
import Reservation from "../../../Models/Reservation.js";

class ProductsController {
    pageResultCount = 12;

    constructor() {
        this.index = this.index.bind(this); // this line allows the index() method to access "this"
    }

    async index(req, res){
        const skip = (req.query.page - 1) * this.pageResultCount;
        const products = await Product.find().skip(skip).limit(this.pageResultCount).exec();
        const total = await Product.countDocuments();

        res.status(200).json({
            products,
            totalPages: Math.ceil(total / this.pageResultCount),
            currentPage: req.query.page,
        });
    }

    async store(req, res){
        const data = {
            title: req.body.title,
            price: req.body.price,
            kind: req.body.kind,
            description: req.body.description,
            imageUrl: req.file.path,
        };

        if (req.body.slug)
            data.slug = req.body.slug;

        await Product.create(data); // code and slug are generated in pre() event

        res.status(201).json({
            msg: "Product created successfully"
        });
    }

    async show(req, res){
        const product = await Product.findOne({_id: req.params.id});
        const reservations = await Reservation.aggregate([
            {
                $match: { productId: product._id }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1
                            }
                        }
                    ],
                }
            },
            {
                $addFields: {
                    userDetails: { $arrayElemAt: ['$userDetails', 0] }
                }
            }
        ]);

        if (product){
            return res.status(200).json({
                'product': product,
                'reservations': reservations,
            });
        }

        res.status(404).json({ msg: 'Product not found' });
    }

    async update(req, res){
        const result = await Product.updateOne(
            {_id: req.params.id},
            req.body,
            { runValidators: true }
        );

        if (result.matchedCount === 1 && result.modifiedCount === 1) {
            return res.status(200).json({ msg: "Product updated successfully" });
        }else if (result.matchedCount === 1){
            return res.status(200).json({ msg: "no change to product detected" });
        }

        res.status(404).json({ msg: 'Product not found' });
    }

    async delete(req, res){
        const result = await Product.deleteOne({_id: req.params.id});

        if (result.deletedCount === 1){
            return res.status(200).json({ msg: "Product deleted successfully" });
        }

        res.status(404).json({ msg: 'Product not found' });
    }
}

export default new ProductsController();
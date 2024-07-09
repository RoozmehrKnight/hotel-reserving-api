import Product from "../../Models/Product.js";
import Reservation from "../../Models/Reservation.js";
import reservation from "../../Models/Reservation.js";

class ProductsController {

    async show(req, res){
        const product = await Product.findOne({slug: req.params.slug});

        let reservations;
        if (req.user){
            reservations = await Reservation.find({
                productId: product.id,
                userId: req.user.id,
            });
        }

        res.json({
            product: product,
            reservations: reservations,
        })
    }
}

export default new ProductsController();
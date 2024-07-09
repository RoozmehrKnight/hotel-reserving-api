import Product from "../../Models/Product.js";
import Reservation from "../../Models/Reservation.js";
import reservation from "../../Models/Reservation.js";
import axios from "axios";

class ProductsController {

    async checkout(req, res){
        const product = await Product.findOne({_id: req.body.productId});

        // make reservation with "false" status
        const reservation = await Reservation.create({
            userId: req.user.id,
            productId: product.id,
            price: product.price,
        });

        // prepare payment gateway
        const response = await axios.post('https://gateway.zibal.ir/v1/request', {
            "merchant": "zibal",
            "amount": 20000,
            "callbackUrl": `http://${process.env.BACKEND_DOMAIN}/api/reservations/callback`,
        });

        reservation.trackId = response.data.trackId;
        reservation.save();

        // return gateway link
        res.json({
            link: `https://gateway.zibal.ir/start/${reservation.trackId}`
        })
    }

    async callback(req, res){
        if (req.query.success){
            const response = await axios.post('https://gateway.zibal.ir/v1/verify', {
                "merchant": "zibal",
                "trackId": req.query.trackId,
            });

            if (response.data.result === 100){
                const reservation = await Reservation.findOne({trackId: req.query.trackId});
                reservation.status = true;
                reservation.save();
            }
        }

        res.redirect(`http://${process.env.FRONTEND_DOMAIN}`);
    }
}

export default new ProductsController();
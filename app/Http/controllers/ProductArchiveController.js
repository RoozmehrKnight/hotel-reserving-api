import Product from "../../Models/Product.js";
import Reservation from "../../Models/Reservation.js";
import reservation from "../../Models/Reservation.js";

class ProductsController {

    async search(req, res){
        const query = [];

        handleTitleFilter(req.body.title, query);
        handleKindFilter(req.body.kind, query);
        handlePriceFilter(req.body.price, query);
        handleDateFilter(req.body.date, query)

        // return res.json(
        //     await getAvailableProductsByDateFilter(new Date(1719949862567), new Date(1))
        // )

        const products = await Product.aggregate(query);

        res.json(products);
    }
}

export default new ProductsController();

function handleTitleFilter(title, query){
    let regex;
    if (title){
        regex = new RegExp(title, 'i'); // 'i' makes the search case-insensitive
    }else{
        regex = new RegExp('', 'i');
    }

    query.push({
        $match: {title: {$regex: regex}}
    });
}

function handleKindFilter(kind, query){
    if (kind){
        query.push({
            $match: {'kind': kind}
        });
    }
}

function handlePriceFilter(price, query){
    if (price){
        query.push({
            $match: {
                price: {$gte: price.startPrice, $lte: price.endPrice},
            }
        });
    }
}

function handleDateFilter(date, query){
    const startDate = new Date(date.startDate);
    const endDate = new Date(date.endDate);

    if (date){
        query.push(
            ...[
                {
                    $lookup: {
                        from: "reservations", // The name of the Reservation collection
                        localField: "_id",
                        foreignField: "productId",
                        as: "reservations"
                    }
                },
                {
                    $match: {
                        $or: [
                            { "reservations": { $size: 0 } },
                            {"reservations.date.startDate": {$gt: endDate}},
                            {"reservations.date.endDate": {$lt: startDate}},
                        ]
                    }
                }
            ]
        );
    }
}

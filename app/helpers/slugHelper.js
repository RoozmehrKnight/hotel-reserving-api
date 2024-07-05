import slugify from "slugify";
import Product from "../Models/Product.js";

export async function makeUniqueProductSlug(title){
    let newSlug = slugify(title, { lower: true, strict: true });

    let count = 0;
    let slugSuffix = '';
    while (await Product.findOne({slug: newSlug + slugSuffix})){
        count++;
        slugSuffix = "-" + count;
    }

    return newSlug + slugSuffix;
}
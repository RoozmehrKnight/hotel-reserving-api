import mongoose from "mongoose";
import slugify from "slugify";
import {generateRandomCode, makeUniqueProductCode} from "../helpers/productCodeHelper.js";
import {makeUniqueProductSlug} from "../helpers/slugHelper.js";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    code: {
        type: String,
        immutable: true,
        required: true,
    },
    kind: {
        type: String,
        required: false,
    },
    imageUrl:{
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
});

productSchema.pre('save', function (next){
    this.updatedAt = Date.now();
    next();
})

productSchema.pre('validate', async function (next) {
    if (this.isNew){
        this.code = await makeUniqueProductCode();

        if (!this.slug)
            this.slug = await makeUniqueProductSlug(this.title);
    }

    next();
});

export default mongoose.model('Product', productSchema);
import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
   userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    trackId: {
        type: String,
        required: false,
    },
    status: {
        type: Boolean,
        default: false,
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

reservationSchema.pre('save', function (next){
    this.updatedAt = Date.now();
    next();
})

export default new mongoose.model("Reservation", reservationSchema);
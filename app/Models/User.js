import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 1,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
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

userSchema.pre('save', function (next){
    this.updatedAt = Date.now();
    next();
})

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

export default new mongoose.model("User", userSchema);
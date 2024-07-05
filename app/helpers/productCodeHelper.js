import Product from "../Models/Product.js";

export function generateRandomCode(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export async function makeUniqueProductCode(){
    let randomCode;
    do {
        randomCode = generateRandomCode();
    }while (await Product.findOne({code: randomCode}));

    return randomCode;
}
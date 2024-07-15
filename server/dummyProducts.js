import mongoose from "mongoose";
import productModel from "./model/productModel.js";
// path

async function connectMongoDb(url) {
    return mongoose.connect(url);
}

async function addDummyProducts() {
    await connectMongoDb('mongodb+srv://admin:admin1234@cluster0.w3huoar.mongodb.net/practiceDatabase');
    // const assetsPath = \.resolve("assets");

    const dummyProducts = [
        {
            name: "Healthforce",
            image: "https://wermoresolutions.com/wemore_html/images/product/Healthforce.JPG"
        },
        {
            name: "ProWings Sanitary Napkin (M)",
            image: "https://wermoresolutions.com/wemore_html/images/product/ProWings_M.JPG"
        },
        {
            name: "ProWings Sanitary Napkin (M)",
            image: "https://wermoresolutions.com/wemore_html/images/product/ProWings_L.JPG"
        }
    ];

    try {
        await productModel.insertMany(dummyProducts);
        console.log("Dummy products added successfully!");
    } catch (error) {
        console.error("Error adding dummy products:", error);
    } finally {
        mongoose.disconnect();
    }
}

addDummyProducts();
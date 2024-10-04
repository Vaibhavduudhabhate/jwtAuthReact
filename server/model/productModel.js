
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Please enter a product name']
    },
    description:{
        type: String,
        required: [true, 'Please enter description']
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL']
    }
}, { timestamps: true });

const productModel = mongoose.model('DummyProduct', productSchema);

export default productModel;

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a product name']
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL']
    }
}, { timestamps: true });

const productModel = mongoose.model('Product', productSchema);

export default productModel;
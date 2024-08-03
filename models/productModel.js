import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'product name is required']
    },
    description: {
        type: String,
        required: [true, 'description is required']
    },
    price: {
        type: Number,
        required: [true, 'price is required']
    },
    stock: {
        type: Number,
        required: [true, 'product stock required']
    },
    quantity: {
        type: Number,
        required: [true, 'product Quantity required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    images: [{
        public_id: String,
        url: String,
    },
    ],
}, {
    timestamps: true
});

const productModel = mongoose.model("Products", productSchema);

export default productModel;


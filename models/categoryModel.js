import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'category name is required']
    }
},{
    timestamps:true
});

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;


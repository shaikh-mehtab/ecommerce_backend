import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

export const createCategory = async (req, res) => {
    try {
        const { category } = req.body;

        //validation
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "please provide category name"
            })
        }

        //category create
        await categoryModel.create({ category })

        res.status(201).send({
            success: true,
            message: "Category Created Succfully",
            category,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

export const getAllCategory = async (req, res) => {
    try {
        const category = await categoryModel.find({})

        res.status(200).send({
            success: true,
            message: "Get Successfully All",
            category,
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

export const deleteCatgory = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id)

        //validation
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "category not Found"
            })
        }

        //find category id froom products
        const product = await productModel.find({ category: category._id })

        //delete id from product
        for (let i = 0; i < product.length; i++) {
            const product = product[i];
            product.category = undefined
            await product.save();
        }

        //category delete
        await category.deleteOne();

        res.status(200).send({
            success: true,
            message: "catgeory deleted successfully"
        })

    } catch (error) {
        //validation for Casterror
        if (error.name === "CastError") {
            res.status(500).send({
                success: false,
                message: "Invalid Id"
            })
        }
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}


export const updateCatgory = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id)

        //validation
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "category not Found"
            })
        }

        const { updatedCategory } = req.body

        //get category is from product
        const product = await productModel.find({ category: category._id })

        //store updated category id in product
        for (let i = 0; i < product.length; i++) {
            const product = product[i];
            product.category = updatedCategory;
            await product.save();
        }

        //update category 
        if (updatedCategory) category.category = updatedCategory;

        await category.save();

        res.status(200).send({
            success: true,
            message: "catgeory updated successfully"
        })

    } catch (error) {
        //for casterror validation 
        if (error.name === "CastError") {
            res.status(500).send({
                success: false,
                message: "Invalid Id"
            })
        }
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}
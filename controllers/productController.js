import productModel from "../models/productModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

export const getAllProductsController = async (req, res) => {
    try {
        const product = await productModel.find({});

        //validation
        if (!product.length > 0) {
            return res.status(404).send({
                success: false,
                message: "Record in Empty"
            })
        }

        res.status(200).send({
            success: true,
            message: "all product fetch successfully",
            product,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)

        //validation
        if (!product) {
            return res.status(404).send({
                status: false,
                message: "Product Not Found"
            });
        }

        res.status(200).send({
            status: true,
            message: "Product find successfully",
            product,
        })
    } catch (error) {
        //cast error valiadtion
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

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        //validation for all field required
        // if(!name || !description || !price || !category || !stock ){
        //     return res.status(500).send({
        //         success:false,
        //         message:"please Provide all fields"
        //     });
        // }

        //check file coming from request or not 
        if (!req.file) {
            return res.status(500).send({
                success: false,
                message: 'please prrovide product image'
            });
        }

        //take file data from getDataUri utils
        const file = getDataUri(req.file);

        //upload file to cloudinary cloud
        const cdb = await cloudinary.v2.uploader.upload(file.content);

        //cloudinary public_id and image url
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url,
        }

        //create product
        const products = await productModel.create({
            name, description, price, category, stock, images: [image]
        });

        res.status(201).send({
            success: true,
            message: 'Product Created Successfully',
            products,
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

export const updateProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)

        //validation
        if (!product) {
            res.status(404).send({
                success: false,
                message: "Product Not Found"
            })
        }

        const { name, description, price, category, stock } = req.body;

        //update products one by one
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (stock) product.stock = stock;

        await product.save();

        res.status(200).send({
            success: true,
            message: "product details updated",
            product,
        })

    } catch (error) {
        //validation for cast error
        if (error.name === "CastError") {
            res.status(500).send({
                success: false,
                message: "Invalid Id"
            })
        }
        re.status(500).send({
            success: false,
            message: error.message
        })
    }
}

export const updateProductImageCOntroller = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)

        //validation
        if (!product) {
            res.status(404).send({
                success: false,
                message: "Product Not Found"
            })
        }

        //check file comes from request or not
        if (!req.file) {
            res.status(404).send({
                success: false,
                message: "Product Image Not Found"
            })
        }

        //get file information from getDataUri utils
        const file = getDataUri(req.file)

        //upload  file to cloudinary
        const cdb = await cloudinary.v2.uploader.upload(file.content);

        //image cloudinary public_id and url
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url,
        }

        //store image public_id and url to database
        product.images.push(image);
        await product.save();

        res.status(200).send({
            success: true,
            message: "Product Image Uploaded"
        })

    } catch (error) {
        //validation for cast error
        if (error.name === "CastError") {
            res.status(500).send({
                success: false,
                message: "Invalid Id",
            })
        }
        //show any error if exist
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

export const deletProductImageController = async (req, res) => {
    try {
        //get product Id
        const product = await productModel.findById(req.params.id)

        //validation
        if (!product) {
            res.status(404).send({
                success: false,
                message: "Product Not Found"
            })
        }

        //get image id
        const id = req.query.id;

        if (!id) {
            return res.status(404).send({
                success: false,
                message: "product image not found"
            })
        }

        //set in -1 images 
        let isExist = -1;

        //get all product image and set -1 to index
        product.images.forEach((item, index) => {
            if (item._id.toString() === id.toString()) isExist = index;
        });

        //check is image in here or not
        if (isExist < 0) {
            return res.status(404).send({
                success: false,
                message: "Image Not Found"
            })
        }

        //delete from clodinary 
        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);

        product.images.splice(isExist, 1);
        await product.save();

        return res.status(200).send({
            success: true,
            message: "Product Image Deleted Successfully",
        })

    } catch (error) {
        //validation for cast error
        if (error.name === "CastError") {
            res.status(500).send({
                success: false,
                message: "Invalid Id",
            })
        }
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)

        //validation
        if (!product) {
            res.status(404).send({
                success: false,
                message: "Product Not Found"
            })
        }

        //get product images
        for (let index = 0; index < product.images.length; index++) {
            await cloudinary.v2.uploader.destroy(product.images[index].public_id)
        }
        
        //delete images 
        await product.deleteOne();

        res.status(200).send({
            success: true,
            message: "Product Deleted Successfully"
        })
    } catch (error) {
        //cast error validation
        if (error.name === "CastError") {
            res.status(500).send({
                success: false,
                message: "Invalid Id",
            })
        }
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}
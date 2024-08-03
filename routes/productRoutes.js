import express from "express";
import {
    createProduct,
    deletProductImageController,
    deleteProductController,
    getAllProductsController,
    getProductById,
    updateProductController,
    updateProductImageCOntroller
} from "../controllers/productController.js";
import { isAdmin, isAuth } from "../middlewares/authMidllerware.js";
import singleUpload from "../middlewares/multer.js";
const router = express.Router();



router.get('/get-all', getAllProductsController)
router.get('/get/:id', getProductById)
router.post('/create', isAuth,isAdmin, singleUpload, createProduct)
router.put('/update/:id', isAuth,isAdmin,singleUpload, updateProductController)
router.put('/update-image/:id', isAuth,isAdmin, singleUpload, updateProductImageCOntroller)
router.delete('/delete-image/:id',isAuth,isAdmin,deletProductImageController)
router.delete('/delete/:id',isAuth,isAdmin,deleteProductController)



export default router
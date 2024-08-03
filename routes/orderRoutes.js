import express from "express";
import {
    changeOrderStatus,
    createOrder,
    getAllOrder,
    getMyAllOrder,
    getSingleOrder
} from "../controllers/orderController.js";
import { isAdmin, isAuth } from "../middlewares/authMidllerware.js";
const router = express.Router();


router.get('/get-all', isAuth, getMyAllOrder);
router.post('/create', isAuth, createOrder); 
router.get('/get/:id', isAuth, getSingleOrder);
router.get('/admin/get-all', isAuth, isAdmin, getAllOrder);
router.get('/admin/order-status/:id', isAuth, isAdmin, changeOrderStatus);


export default router;
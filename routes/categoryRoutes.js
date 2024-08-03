import express from "express"
import { isAdmin, isAuth } from "../middlewares/authMidllerware.js";
import {
    createCategory,
    deleteCatgory,
    getAllCategory,
    updateCatgory
} from "../controllers/categoryController.js";
const router = express.Router();

router.get('/get-all', getAllCategory)
router.post('/create', isAuth,isAdmin, createCategory)
router.put('/update/:id', isAuth,isAdmin, updateCatgory)
router.delete('/delete/:id', isAuth,isAdmin, deleteCatgory)



export default router;
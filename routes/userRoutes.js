import express from "express";
import {
    getUserProfileController,
    loginController,
    logoutController,
    registerController,
    updatePasswordControler,
    updateProfilePicController,
    updateUserProfileController
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMidllerware.js";
import singleUpload from "../middlewares/multer.js";

// import uploadFile from "../middlewares/uploadMidddleware.js";

const router = express.Router();

router.post('/register', registerController)
router.post('/login', loginController)
router.get('/profile', isAuth, getUserProfileController)
router.get('/logout', isAuth, logoutController)

router.put('/profile-update', isAuth, updateUserProfileController)
router.put('/update-password', isAuth, updatePasswordControler)
router.put('/upload-pic',isAuth,singleUpload,updateProfilePicController)

// router.put('/update-profile-pic', isAuth, uploadFile, updateProfilePicController)


export default router ;
import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'UnAuthorized User'
            })
        }

        const decodeData = JWT.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decodeData._id);

        next();

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error In Auth Api'
        })
    }
}

export const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).send({
            success: fasle,
            message:"admin only"
        });
    }

    next();
}
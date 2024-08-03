import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { getDataUri } from "../utils/features.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';

export const registerController = async (req, res) => {
    try {
        const { name, email, password, address, city, country, phone } = req.body;

        //validate to all field  
        if (!name || !email || !password || !address || !city || !country || !phone) {
            return res.status(500).send({
                success: false,
                message: "please provide all fields",
            });
        }

        //find user in datbase
        const existingUser = await userModel.findOne({ email })

        //check user is already exist in database
        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: 'User already exist'
            })
        }

        //    I hashpassword through model thats way comment this
        //  const hashPassword = await bcrypt.hash(password, 10);

        //create user in database
        const user = await userModel.create({
            name,
            email,
            password,
            address,
            city,
            country,
            phone
        });

        res.status(201).json({
            success: true,
            message: "Registration Success,Please Login",
            user,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validation for email
        if (!email) {
            return res.status(500).send({
                success: false,
                message: "Please Enter Email"
            })
        }

        //validation for password
        if (!password) {
            return res.status(500).send({
                success: false,
                message: "Please Enter Password"
            })
        }

        //find user in datbase
        const user = await userModel.findOne({ email })

        //check user exist in database or not
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Invalid User"
            })
        }

        // i compare password through model function thats way comment this
        // const isMatch = await bcrypt.compare(password, user.password)

        //compare user password to store database password 
        const isMatch = await user.comparePassword(password);

        //if both passwords not match then 
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Invalid Credentials"
            })
        }

        //generate jwt access token and secerate key
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '9h' });

        //store token in browser to cookies with cookies multiple options
        res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV === 'development' ? true : false,
            secure: process.env.NODE_ENV === 'development' ? true : false,
            maxAge: 10 * 24 * 60 * 60 * 1000
        });

        res.status(200).send({
            success: true,
            message: "Login Successfully",
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

export const getUserProfileController = async (req, res) => {
    try {
        //get user data
        const user = await userModel.findById(req.user._id);

        //hide user password
        user.password = undefined;

        //user validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not Found"
            })
        }

        res.status(200).send({
            success: true,
            message: 'User Profile Fetched Successfully',
            user,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

export const logoutController = async (req, res) => {
    try {
        //cleare token  from cookies
        res.clearCookie('token');

        res.status(200).send({
            success: true,
            message: "Logout Successfully"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            messsage: error.message
        })
    }
}

export const updateUserProfileController = async (req, res) => {
    try {
        //get login user id
        const user = await userModel.findById(req.user._id)

        //get request from user
        const { name, email, address, city, country, phone } = req.body

        //update user data
        if (name) user.name = name;
        if (email) user.email = email;
        if (address) user.address = address;
        if (city) user.city = city;
        if (country) user.country = country;
        if (phone) user.phone = phone;

        //save updated data to  databse
        await user.save();

        res.status(200).send({
            success: true,
            message: "User Profile Updated",
            user,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            messsage: error.message
        });
    }
}

export const updatePasswordControler = async (req, res) => {
    try {
        //find login user id
        const user = await userModel.findById(req.user._id);

        //take previous password fromm user and new password
        const { oldPassword, newPassword } = req.body;

        //validation
        if (!oldPassword) {
            return res.status(200).send({
                success: false,
                message: "Please Provide Old Password"
            })
        }

        //validation
        if (!newPassword) {
            return res.status(200).send({
                success: false,
                message: "Please Provide New Password"
            })
        }

        //user enter oldpassword to database stored password
        const isMatch = await user.comparePassword(oldPassword)

        //validation to check  password match or not 
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invalid Old Password"
            })
        }

        //update password
        user.password = newPassword;

        //save updated password
        await user.save();

        res.status(200).send({
            success: true,
            message: "Password Updated Successfully"
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            messsage: error.message
        })
    }
}


export const updateProfilePicController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);

        // for get file and file-data
        const file = getDataUri(req.file);

        // delete file from cloudinary
        await cloudinary.v2.uploader.destroy(user.profilePic.public_id);

        //upload file to cloudinary
        const cdb = await cloudinary.v2.uploader.upload(file.content);

        //profilPic public_id and image url
        user.profilePic = {
            public_id: cdb.public_id,
            url: cdb.secure_url,
        }

        //save image
        await user.save();

        res.status(200).send({
            success: true,
            message: "Profile Pic Updated"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}





// through upload folder 
// export const updateProfilePicController = async (req, res) => {
//     try {
//         const user = await userModel.findById(req.user._id)

//         if (!user) {
//             res.status(404).send({
//                 success: false,
//                 message: "User Not Found"
//             })

//             if (user.profilePic) {
//                 const previousProfilePicPath = path.resolve(user.profilePic);
//                 try {
//                     await fs.unlink(previousProfilePicPath);
//                     console.log("previous path delete succfully");
//                 } catch (error) {
//                     console.error("error to delete previou pic", error);
//                 }
//             }

//             if (req.file) {
//                 user.profilePic = req.file.path;
//             } else {
//                 return res.status(400).send({
//                     success: false,
//                     message: "No file Upload"
//                 });
//             }

//             await user.save();

//             user.password = undefined;

//             res.status(200).send({
//                 success: true,
//                 message: "Profile Picture updated Successfully",
//                 user,
//             })
//         }
//     } catch (error) {
//         res.status(500).send({
//             success: false,
//             message: "Error in Api"
//         })
//     }
// }

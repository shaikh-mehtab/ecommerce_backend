import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email already taken']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: [6, 'password length should be greather then 6 character']
    },
    address: {
        type: String,
        required: [true, 'address is required']
    },
    city: {
        type: String,
        required: [true, 'city is required']
    },
    country: {
        type: String,
        required: [true, 'country is required']
    },
    phone: {
        type: String,
        required: [true, 'phone is required']
    },
    profilePic: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    role:{
        type:String,
        default:"user", 
    }
}, {
    timestamps: true
});

// bcrypt password 
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10);
})

// bcrypt campare password
userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
}

const userModel = mongoose.model("Users", userSchema);
export default userModel;
import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, 'address is required']
        },
        city: {
            type: String,
            required: [true, 'city name is required']
        },
        country: {
            type: String,
            required: [true, 'country is reqquired']
        }
    },
    orderItems: [
        {
            name: {
                type: String,
                required: [true, 'product name is require']
            },
            price: {
                type: Number,
                required: [true, 'price is required']
            },
            quantity: {
                type: Number,
                required: [true, 'quantity is required']
            },
            image: {
                type: String,
                required: [true, 'image is required']
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Products',
                required:true,
            }
        }
    ],
    paymentMehtod:{
        type:String,
        enum:["COD","ONLINE"],
        default:"COD",
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:[true,'user is required']
    },
    paidAt:Date,
    paymentInfo:{
        id:String,
        status:String,
    },
    itemPrice:{
        type:Number,
        requierd:[true,'item price is required']
    },
    tax:{
        type:Number,
        requierd:[true,'tax price is required']
    },
    shippingCharges:{
        type:Number,
        requierd:[true,'item shippingCharges is required']
    },
    totalAmount:{
        type:Number,
        requierd:[true,'item totalAmount  is required']
    },
    orderStatus:{
        type:String,
        enum:['processing','shipped','deliverd'],
        default:'processing'
    },
    deliverdAt:Date
}, {
    timestamps: true
});

const orderModel = mongoose.model("Orders", orderSchema);

export default orderModel;


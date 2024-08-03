import orderModel from "../models/oderModel.js";
import productModel from "../models/productModel.js";


export const createOrder = async (req, res) => {
    try {
        const { shippingInfo,
            orderItems,
            paymentMehtod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount
        } = req.body;

        //validation for all fields 
        // if(!shippingInfo || !orderItems || !paymentMehtod || !paymentInfo || !itemPrice || !tax || !shippingCharges|| !totalAmount){
        //     return res.status(404).send({
        //         success:false,
        //         message:"Please Fillout All Fields"
        //     })
        // }

        //create order
        await orderModel.create({
            user: req.user._id,
            shippingInfo,
            orderItems,
            paymentMehtod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount,
        });

        //update stock after order
        for (let i = 0; i < orderItems.length; i++) {
            const product = await productModel.findById(orderItems[i].product)
            product.stock -= orderItems[i].quantity;
            await product.save();
        }

        res.status(200).send({
            sucess: true,
            message: "Order Placed Successfully",
        })


    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

//get user Order
export const getMyAllOrder = async (req, res) => {

    try {
        const order = await orderModel.find({ user: req.user._id })

        //validation
        if (!order) {
            return res.status(404).send({
                success: false,
                message: "no Order Found"
            })
        }

        res.status(200).send({
            success: true,
            message: "Get Order Data",
            order: order.length,
            order,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

export const getSingleOrder = async (req, res) => {
    try {
        const orders = await orderModel.findById(req.params.id)

        if (!orders) {
            return res.status(404).send({
                success: false,
                message: "No Order Found"
            })
        }

        res.status(200).send({
            success: true,
            message: "get order succesfully",
            orders,
        })
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(500).send({
                success: false,
                message: "Invalid Id"
            });
        }
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

//get all order to admin
export const getAllOrder = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).send({
            success: true,
            message: "All Order Data",
            totalOrders: orders.lenght,
            orders,
        });

    } catch (error) {
        res.statu(500).send({
            success: false,
            message: error.message
        })
    }
}


export const changeOrderStatus = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id)

        if (!order) {
            return res.status(404).send({
                success: false,
                message: "order not found"
            })
        }

        if (order.orderStatus === "processing") order.orderStatus = "shipped"
        else if (order.orderStatus == "shipped") {
            order.orderStatus = "deliverd"
            order.deliverdAt = Date.now()
        } else {
            return res.status(500).send({
                success: false,
                message: "order already deliverd"
            })
        }

        await order.save(); 

        res.status(200).send({
            success: true,
            message: "order status updated"
        })

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(500).send({
                success: false,
                message: "Invalid Id"
            })
        }
        res.statu(500).send({
            success: false,
            message: error.message
        })
    }
}

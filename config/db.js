import mongoose  from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`mongodb connected ${mongoose.connection.host}`)
    } catch (error) {
        console.log(`mongo db eror ${error}`.bgRed.white)
    }
}

export default connectDB ;
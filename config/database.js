import mongoose from "mongoose";
const connectDB= async ()=> {
    try {
        await mongoose.connect(process.env.MONGO_ID);
        console.log("MongoDB connected succesfully");
    }
    catch(error) {
        console.error("MongoDB connection failed");
        process.exit(1);
    }
};
export default connectDB;

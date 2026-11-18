import mongoose from "mongoose";

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(()=>console.log("DB Connect Successfully"))
        .catch(()=>console.log("DB Error"))
    } catch (error) {
        console.log(`configDB ${error}`)
        
    }
}
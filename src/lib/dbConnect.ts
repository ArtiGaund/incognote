import mongoose from "mongoose";
import { DB_NAME } from "@/constants";

//type of database
type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect() : Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database.")
        return
    }
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {})
        connection.isConnected = db.connections[0].readyState
        console.log("DB connected Successfully");

        
    } catch (error) {
        
        console.log("DB connection failed ",error);
        
        process.exit(1)
    }
}

export default dbConnect
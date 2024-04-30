// writing api

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST( request : Request){
    // when someone is requesting, then only we will connect database
    await dbConnect()


    try {
        const { username, email, password } = await request.json()
    } catch (error) {
        console.error("Error in registering user ",error)
        return Response.json(
            {
                success: false,
                message: "Error in registering user"
            },
            {
                status: 500
            }
        )
    }
}
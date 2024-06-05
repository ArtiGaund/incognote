import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
// import { z } from "zod";
// // Schema of username validation
// import { usernameValidation } from "@/schemas/signUpSchema";

export async function POST(request: Request){
    await dbConnect()

    try {

        const { username, code } = await request.json()

        // decoding values from url (space is converted into %20%)
        const decodedUsername =decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 500
                }
            )
        }
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                },
                {
                    status: 200
                }
            )
        }else if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired,please signup again to get new code."
                },
                {
                    status: 400
                }
            )
        }else{
            return Response.json(
                {
                    success: false,
                    message: "Verification code is not correct"
                },
                {
                    status: 400
                }
            )
        }
        
    } catch (error) {
        console.error("Error verifying user: ",error);
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            {
                status: 500
            }
        )
    }
}
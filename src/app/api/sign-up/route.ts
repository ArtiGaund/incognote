// writing api

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST( request : Request){
    // when someone is requesting, then only we will connect database
    await dbConnect()

    try {
        // taking out everything from the request given by user
        const { username, email, password } = await request.json()
        // checking whether username is present in database and also verified
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username already exist. "
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({ email })
        // generating verifyCode
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if(existingUserByEmail){
            // existing user is verified 
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already exist with this email",
                }, { status: 400})
            }else{
                // existing user is there but not verified
                const hashedPassword = await bcrypt.hash(password, 10);
                // overwriting the password only
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                // saving this user
                await existingUserByEmail.save()
            }
        }else{
            // user came for the first time bz email doesn't exist in database
            // hashing the password
            const hashedPassword = await bcrypt.hash(password, 10)
            // setting expiry date for verification code 1 hour
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            // saving user in database
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            // saving new user
            await newUser.save()
        }
        // sending verification email to user
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        // failed
        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message,
            }, { status: 500})
        }
        // success
        return Response.json({
            success: true,
            message: "User registered successfully, Please check your email to verify your account!",
        }, { status: 201})
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
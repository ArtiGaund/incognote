import { getServerSession } from "next-auth";
// getServerSession need crediential provider-> authOption
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";

// getting all messages
export async function GET(request: Request) {
    await dbConnect()
    // getting current login user
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            {
                status: 401
            }
        )
    }

   
    // we are taking userId as string in models, it will create problem in aggregation process
    // so we will convert it, and will send the mongoose object id
    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        // we are going to create many users, if we will return the messages array as it is, there can be 
        // possibility there are 1000+ messages, we don't want to return like this. we want to do pagination
        // taking multiple document
        const user = await UserModel.aggregate([
            {
                // getting user
                $match: { id: userId }
            },
            {
                // unbinding the arrays 
                $unwind: "$messages",
            },
            {
                // sort
                $sort: { 'messages.createdAt': -1}
            },
            {
                // grouping document (will store data in sort form)
                $group: {_id: '$_id', messages: {$push: '$messages'}}
            }
        ])
        if(!user || user.length === 0){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error while getting messages: ",error);
        
        return Response.json(
            {
                success: false,
                message: "Unexpected errors"
            },
            {
                status: 500
            }
        )
    }
}
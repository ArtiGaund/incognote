import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { Message } from "@/models/user.model";


export async function POST(request: Request){
    await dbConnect()
    // any one can send message to you, anyone can give feedback to you, so there is no need to be login
    const { username, content } = await request.json()
    try {
        const user = await UserModel.findOne({ username})
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }
        // checking is user accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages"
                },
                {
                    status: 403
                }
            )
        }
        // creating new message
        const newMessage = { content, createdAt: new Date()}
        // pushing this message in user
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json(
            {
                success: true,
                message: "Message send successfully"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error while send messages: ",error);
        
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            {
                status: 500
            }
        )
    }
}
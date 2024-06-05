import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { z } from "zod";
// Schema of username validation
import { usernameValidation } from "@/schemas/signUpSchema";

// creating query schema -> to check any object or variable
const UsernameQuerySchema = z.object({
    username: usernameValidation
})

// writing GET method, when someone will send this username, i can check whether this username is valid or not
// while type only

export async function GET(request: Request) {
    // qpi-> localhost:3000/api/check-username-unique?username=one

    await dbConnect()

    try {
        // checking username using url, -> query is recieved by url 
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // validating with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        // console.log("Result ",result);
        if(!result.success){
            // sending error for username error
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length> 0 ? usernameErrors.join(',') :
                    'Invalid query parameters',
                },
                { status: 400}
            )
        }

        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })
        if(existingVerifiedUser){
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                { status: 400}
            )
        }
        return Response.json(
            {
                success: true,
                message: "Username is unique",
            },
            { status: 200}
        )
        
    } catch (error) {
        console.error("Error checking username: ",error);
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status: 500
            }
        )
    }
}
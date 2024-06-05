// custom types will come here (standardize)
import { Message } from "@/models/user.model";


// how response will be shown
export interface ApiResponse{
    success: boolean,
    message: string,
    isAcceptingMessage?: boolean,
    messages?: Array<Message>
}


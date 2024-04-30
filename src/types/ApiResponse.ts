// custom types will come here (standardize)
import { Message } from "@/models/user.model";


// how response will be shown
export interface ApiResponse{
    success: boolean,
    message: string,
    isAcceptiongMessages?: boolean,
    messages?: Array<Message>
}

// Seinario -> some api response will be where user have send only the message or api response is send where you have collected 
// many messages from the database and you want to show them thats why Message is imported
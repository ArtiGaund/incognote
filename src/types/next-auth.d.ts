
import 'next-auth'
import { DefaultSession } from 'next-auth';


declare module 'next-auth' {
    // changing in the module ( we are doing it for only 1 module User)
    interface User{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
    interface Session{
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user']
    }
}
// defaultSession is important
declare module 'next-auth/jwt'{
    interface JWT{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}
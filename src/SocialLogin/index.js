import {login as loginFacebook,logout as logoutFacebook} from "./facebook";
import {login as loginApple,logout as logoutApple} from "./apple";
import {login as loginGoogle,logout as logoutGoogle} from "./google";
export const socialLogin = {
    facebook : {
        login : loginFacebook,
        logout: logoutFacebook
    },
    google : {
        login : loginGoogle,
        logout: logoutGoogle
    },
    apple : {
        login : loginApple,
        logout: logoutApple
    }
}

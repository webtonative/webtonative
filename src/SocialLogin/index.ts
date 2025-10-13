import { login as loginFacebook, logout as logoutFacebook } from "./facebook";
import { login as loginApple } from "./apple";
import { login as loginGoogle, logout as logoutGoogle } from "./google";

/**
 * Social login module for Facebook, Google, and Apple authentication
 */
export const socialLogin = {
	facebook: {
		login: loginFacebook,
		logout: logoutFacebook,
	},
	google: {
		login: loginGoogle,
		logout: logoutGoogle,
	},
	apple: {
		login: loginApple,
	},
};

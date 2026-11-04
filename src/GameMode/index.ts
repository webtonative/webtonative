import { platform, registerCb, webToNative } from "../utills";
import { GameModeResponse, SetGameStateOptions } from "./types";

const NOT_NATIVE_ERROR = "This function will work in Native App Powered By WebToNative";

/**
 * Registers a one-shot listener for `action`, triggers the Android bridge call and resolves with the response.
 * Game Mode is Android only — on iOS the promise rejects.
 * `data` is JSON-stringified for the Android bridge (omit for no-arg methods).
 */
const callGameMode = (action: string, data?: object): Promise<GameModeResponse> => {
	return new Promise((resolve, reject) => {
		if (platform !== "ANDROID_APP") {
			reject(platform === "IOS_APP" ? `${action} is only available on Android` : NOT_NATIVE_ERROR);
			return;
		}

		registerCb(
			(response: GameModeResponse) => {
				if (response.type === action) {
					resolve(response);
				}
			},
			{ key: action }
		);

		if (!webToNative[action]) {
			reject(`${action} is not supported in this app version`);
			return;
		}
		data ? webToNative[action](JSON.stringify(data)) : webToNative[action]();
	});
};

/**
 * Returns the Game Mode the user picked for the app in the system Game Dashboard
 * ("standard" | "performance" | "battery" | "custom" | "unsupported").
 * Android has no listener for Game Mode changes, so call this again whenever the app resumes.
 * @example
 * wtn.GameMode.getGameMode().then((res) => console.log(res.mode));
 */
export const getGameMode = (): Promise<GameModeResponse> => {
	return callGameMode("getGameMode");
};

/**
 * Tells Android what the game is doing, so the system can tune performance for it.
 * Requires Android 13+. Resolves with `success: false` and a `reason`
 * ("invalidMode" | "unsupported") when the state can't be applied.
 * @example
 * wtn.GameMode.setGameState({
 *   isLoading: false,
 *   mode: "gameplayUninterruptible",
 * }).then((res) => console.log(res.success));
 */
export const setGameState = (options: SetGameStateOptions): Promise<GameModeResponse> => {
	const { isLoading = false, mode } = options || ({} as SetGameStateOptions);
	return callGameMode("setGameState", { isLoading, mode });
};

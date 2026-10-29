/**
 * Game Mode the user picked for the app in the system Game Dashboard.
 * "unsupported" is returned below Android 12, when GAME_MODE is off,
 * or when the app isn't declared as a game.
 */
export type GameModeValue = "standard" | "performance" | "battery" | "custom" | "unsupported";

/**
 * What the game is currently doing, used by Android to tune performance.
 */
export type GameStateMode =
	| "none"
	| "gameplayInterruptible"
	| "gameplayUninterruptible"
	| "content";

export interface GameModeResponse {
	type: string;
	success: boolean;
	mode?: GameModeValue;
	reason?: "invalidMode" | "unsupported" | string;
	[key: string]: any;
}

export interface SetGameStateOptions {
	mode: GameStateMode;
	isLoading?: boolean;
}

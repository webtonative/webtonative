import { platform, registerCb, webToNative, webToNativeIos } from "../utills";
import {
	AIResponse,
	AICallback,
	AIIosMessage,
	AIExtractDataFromImageOptions,
} from "./types";

const EXTRACT_DATA_FROM_IMAGE = "aiExtractDataFromImage";

/** Reports a request that was never sent, so no native response is coming for it. */
const failLocally = (error: string, callback?: AICallback): void => {
	callback &&
		callback({
			type: EXTRACT_DATA_FROM_IMAGE,
			isSuccess: false,
			error,
		});
};

/**
 * Captures or picks an image in the app and returns the fields described by the
 * schema, read out of that image by the model.
 * @example AI.extractDataFromImage({
 *   mode: "camera",
 *   schema: {
 *     fullName: { type: "string", description: "Full name of the person" },
 *     isExpired: { type: "boolean", description: "Whether document expiry date is past" },
 *   },
 *   uiOptions: { title: "Scan Driver's License", overlayHint: "Align ID within the frame" },
 *   callback: (response) => console.log(response.data),
 * })
 */
export const extractDataFromImage = (options: AIExtractDataFromImageOptions): void => {
	const { mode = "camera", imageString, schema, uiOptions, callback } =
		options || ({} as AIExtractDataFromImageOptions);

	if (!schema || typeof schema !== "object" || !Object.keys(schema).length) {
		return failLocally("schema is required and must describe at least one field", callback);
	}
	if (mode === "base64" && !imageString) {
		return failLocally('imageString is required when mode is "base64"', callback);
	}
	if (!["ANDROID_APP", "IOS_APP"].includes(platform)) {
		return failLocally("This function will work in Native App Powered By WebToNative", callback);
	}

	const payload = {
		mode,
		schema,
		...(mode === "base64" && { imageString }),
		...(uiOptions && { uiOptions }),
	};

	registerCb(
		(response: AIResponse) => {
			const { type } = response;
			if (type === EXTRACT_DATA_FROM_IMAGE) {
				callback && callback(response);
			}
		},
		{ key: EXTRACT_DATA_FROM_IMAGE }
	);

	platform === "ANDROID_APP" &&
		webToNative[EXTRACT_DATA_FROM_IMAGE] &&
		webToNative[EXTRACT_DATA_FROM_IMAGE](JSON.stringify(payload));

	if (platform === "IOS_APP" && webToNativeIos) {
		webToNativeIos.postMessage({
			action: EXTRACT_DATA_FROM_IMAGE,
			...payload,
		} as AIIosMessage);
	}
};

export default { extractDataFromImage };

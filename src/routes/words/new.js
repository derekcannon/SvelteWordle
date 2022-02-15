import AES from "crypto-js/aes";
import { MAX_WORD_LETTERS } from "$lib/constants.js";

export async function get() {
	return {
		body: {},
	};
}

export async function post({ request }) {
	const data = await request.json();
	const { word } = data;

	// validation should go here

	const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
	const protocol = import.meta.env.VITE_PROTOCOL || "https";
	const baseUrl = import.meta.env.VITE_VERCEL_URL;

	const encryptedWordObject = AES.encrypt(
		JSON.stringify({ word: word.toLowerCase().slice(0, MAX_WORD_LETTERS) }),
		encryptionKey,
	).toString();

	const query = new URLSearchParams();
	query.set("ewo", encryptedWordObject);

	return {
		status: 201,
		body: {
			relativeWordUrl: `/?${query.toString()}`,
			wordUrl: `${protocol}://${baseUrl}/?${query.toString()}`,
		},
	};
}

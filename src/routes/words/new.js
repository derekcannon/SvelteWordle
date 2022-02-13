import AES from "crypto-js/aes";

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
		JSON.stringify({ word: word.toLowerCase() }),
		encryptionKey,
	).toString();

	return {
		status: 201,
		body: {
			wordUrl: `${protocol}://${baseUrl}/?ewo=${encodeURIComponent(encryptedWordObject)}`,
		},
	};
}

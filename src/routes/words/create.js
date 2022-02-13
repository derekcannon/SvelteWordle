import AES from "crypto-js/aes";

export async function get() {
	return {
		body: {},
	};
}

export async function post({ request }) {
	const data = await request.formData();
	const word = data.get("word");

	// validation should go here

	const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
	const baseUrl = import.meta.env.VITE_VERCEL_URL;

	const encryptedWordObject = AES.encrypt(
		JSON.stringify({ word: word.toLowerCase() }),
		encryptionKey,
	).toString();

	return {
		status: 201,
		body: {
			wordUrl: `https://${baseUrl}/?ewo=${encodeURIComponent(encryptedWordObject)}`,
		},
	};
}

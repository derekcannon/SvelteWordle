import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

export async function get({ url }) {
	const encryptedWordObject = url.searchParams.get("ewo");
	let decryptedWordObject;

	if (encryptedWordObject) {
		const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
		const bytes = AES.decrypt(encryptedWordObject, encryptionKey);
		decryptedWordObject = JSON.parse(bytes.toString(Utf8));
	}

	return {
		body: {
			initialWord: decryptedWordObject?.word,
		},
	};
}

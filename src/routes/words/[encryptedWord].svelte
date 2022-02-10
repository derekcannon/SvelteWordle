<script context="module">
	import AES from "crypto-js/aes";
	// import Utf8 from "crypto-js/enc-utf8";

	export async function load({ params }) {
		let encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
		// let { encryptedData } = params;

		const data = { word: "derek" };
		const ciphertext = AES.encrypt(
			JSON.stringify(data),
			import.meta.env.VITE_ENCRYPTION_KEY,
		).toString();
		console.log("url version:", encodeURIComponent(ciphertext));

		// /** Decryption */
		// const bytes = AES.decrypt(ciphertext, encryptionKey);
		// const decryptedData = JSON.parse(bytes.toString(Utf8));
		// // console.log("Decrypted Data", decryptedData);

		// const bytes = AES.decrypt(encryptedData, encryptionKey);
		// const decryptedData = JSON.parse(bytes.toString(Utf8));

		// if (!encryptedData) {
		// 	return {
		// 		status: 302,
		// 		redirect: "/",
		// 	};
		// }

		return {
			props: {
				word: "hi",
				// word: decryptedData.word,
			},
		};
	}
</script>

<script>
	export let word;
</script>

<h1>Hello, {import.meta.env.VITE_ENCRYPTION_KEY}</h1>

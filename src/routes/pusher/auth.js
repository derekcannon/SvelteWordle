import Pusher from "pusher";

export async function post({ request }) {
	const data = await request.formData();

	const {
		VITE_PUSHER_APP_ID,
		VITE_PUSHER_KEY,
		VITE_PUSHER_SECRET,
		VITE_PUSHER_CLUSTER,
		VITE_PUSHER_USE_TLS,
	} = import.meta.env;

	const pusher = new Pusher({
		appId: VITE_PUSHER_APP_ID,
		key: VITE_PUSHER_KEY,
		secret: VITE_PUSHER_SECRET,
		cluster: VITE_PUSHER_CLUSTER,
		useTLS: VITE_PUSHER_USE_TLS,
	});

	const auth = pusher.authenticate(data.get("socket_id"), data.get("channel_name"), {
		user_id: data.get("userId"),
		user_info: {
			name: data.get("name"),
		},
	});

	return {
		status: 200,
		body: auth,
	};
}

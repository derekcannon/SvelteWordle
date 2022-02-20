import Pusher from "pusher";

export async function get() {
	return {};
}

export async function post({ request }) {
	const allData = await request.json();
	const { channelName, data } = allData;

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

	// TODO: only needed if there are other members?
	try {
		await pusher.trigger(channelName, "sync-shared-state", data);
		console.log("returning body");
		return {
			body: {
				status: 201,
				data,
			},
		};
	} catch (e) {
		console.log("returning error");
		return {
			body: {
				status: 500,
			},
		};
	}
}

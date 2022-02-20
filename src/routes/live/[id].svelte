<script>
	import { onMount } from "svelte";
	import { v4 as uuid } from "uuid";
	import { page } from "$app/stores";
	import WordRow from "$comp/common/WordRow.svelte";
	import Keyboard from "$comp/common/Keyboard.svelte";
	import AppContainer from "$comp/common/AppContainer.svelte";
	import Alert from "$comp/common/Alert.svelte";

	let wordLetterLimit = 5;
	let name = "";
	let userId = uuid();
	let guessLetters = [];
	let pusher;
	let gameOver = false;
	let channel;
	let members;
	let isSubmitting = false;
	let alert;
	let secondaryAlert;

	// these two have to be related:
	let canGuess = false;
	let sharedAppState = {
		host: null,
		orderedPlayerIds: [],
		updatedAt: null,
		currentPlayerId: null,
		guessData: [],
	};

	$: activePlayer = members?.members[sharedAppState.currentPlayerId];
	$: isYourTurn = sharedAppState.currentPlayerId === userId;
	$: {
		activePlayer && secondaryAlert?.set(isYourTurn ? null : `It's ${activePlayer.name}'s turn.`);
	}

	$: console.log("activePlayer", activePlayer);
	$: console.log("isyourturn", isYourTurn);

	$: isSignedIn = Boolean(name && pusher);
	$: canGuess = isSignedIn; // && isMyTurn;
	$: isHost = sharedAppState.host === members?.me?.id;
	$: guesses = sharedAppState.guessData.map((data) => {
		return data.guessLetters;
	});

	const channelName = `presence-${$page.params.id}`;

	function connectToChannel() {
		Pusher.logToConsole = true; // TODO: remove this if not dev

		pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
			cluster: import.meta.env.VITE_PUSHER_CLUSTER,
			auth: {
				params: {
					name,
					userId,
				},
			},
		});

		channel = pusher.subscribe(channelName);

		channel.bind("pusher:subscription_error", (error) => {
			console.error(error);
			alert.flashMessage("Unable to connect. Try again later.");
		});

		channel.bind("sync-shared-state", function (newState) {
			console.log("received sync-shared-state");
			sharedAppState = newState;
		});

		channel.bind("pusher:member_added", async function (newUser) {
			members = channel.members;

			if (isHost) {
				sharedAppState.orderedPlayerIds = [...sharedAppState.orderedPlayerIds, newUser.id];

				console.log("triggering sync-shared-state");
				try {
					await fetch(`/live/${channelName}`, {
						method: "POST",
						headers: {
							accept: "application/json",
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							channelName: channelName,
							data: sharedAppState,
						}),
					});
					console.log("triggering sync-shared-state DONE");
				} catch (e) {
					console.error(e);
				}
			}
		});

		channel.bind("pusher:member_removed", function (user) {
			members = channel.members;

			sharedAppState.orderedPlayerIds = [
				...new Set(sharedAppState.orderedPlayerIds.filter((id) => id !== user.id)),
			];

			// TODO: if member leaves and it's their turn, give turn to someone else
			if (sharedAppState.currentPlayerId === user.id) {
			}

			// TODO: if host leaves, promote someone else to host
			if (sharedAppState.host === user.id) {
			}
		});

		channel.bind("pusher:subscription_succeeded", function () {
			members = channel.members;

			if (members.count === 1) {
				sharedAppState = {
					...sharedAppState,
					...{
						host: userId,
						currentPlayerId: userId,
						orderedPlayerIds: [...new Set([...sharedAppState.orderedPlayerIds, userId])],
					},
				};
			}
		});
	}

	function filterKeypress({ key, keyCode, metaKey = false }) {
		if (metaKey) return;

		const isAlphabetKey = keyCode >= 65 && keyCode <= 90;
		const isOtherKeyValid = ["Enter", "Backspace"].includes(key);

		if (isAlphabetKey || isOtherKeyValid) {
			return { key, keyCode };
		}
	}

	async function handleKeypressName(keyPressed) {
		if (name.length >= 10 && keyPressed.key !== "Backspace") return;

		// if (Math.min(Math.max(name.length, 1), 10)
		if (keyPressed.key === "Enter") {
			if (name.length < 3) {
				alert.flashMessage("Enter at least 3 letters.");
				return;
			}

			connectToChannel();
		} else if (keyPressed.key === "Backspace") {
			name = name.slice(0, name.length - 1);
		} else {
			name = name + keyPressed.key;
		}
	}

	function buildGuessData(guessLetters) {
		return {
			userId,
			guessLetters,
		};
	}

	function updateGuessData(guessLetters) {
		sharedAppState.guessData = [...sharedAppState.guessData, buildGuessData(guessLetters)];
	}

	function getNextPlayerId(currentPlayerId) {
		const totalPlayers = sharedAppState.orderedPlayerIds.length;
		const nextPlayerIndex = sharedAppState.orderedPlayerIds.indexOf(currentPlayerId) + 1;

		return sharedAppState.orderedPlayerIds[nextPlayerIndex % totalPlayers];
	}

	async function handleKeypress({ key, keyCode, metaKey = false }) {
		if ((isSignedIn && !isYourTurn) || isSubmitting) return;

		if (metaKey) return;

		if (gameOver) {
			if (key === "Enter") {
				// reset();
			}
			return;
		}

		if (key === "Enter" && canGuess) {
			// TODO: verify guess is real word
			isSubmitting = true;

			updateGuessData(guessLetters);
			sharedAppState.currentPlayerId = getNextPlayerId(sharedAppState.currentPlayerId);

			guessLetters = [];

			try {
				console.log("triggering sync-shared-state");
				// TODO: this has to be current route, not live/test
				await fetch(`/live/${channelName}`, {
					method: "POST",
					headers: {
						accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						channelName: channelName,
						data: sharedAppState,
					}),
				});
				console.log("triggering sync-shared-state DONE");
			} catch (error) {
				console.error(e);
				alert.flashMessage("Failed to submit answer. Try reloading.");
			} finally {
				isSubmitting = false;
			}
		}

		if (keyCode >= 65 && keyCode <= 90 && guessLetters.length < wordLetterLimit) {
			guessLetters = [...guessLetters, key.toLowerCase()];
		} else if (key === "Backspace") {
			guessLetters.pop();
			guessLetters = guessLetters;
		}
	}

	function forwardKeypress(args) {
		if (!isSignedIn) {
			return handleKeypressName(args);
		} else {
			handleKeypress(args);
		}
	}

	onMount(() => {
		return () => {
			pusher?.unsubscribe(channelName);
		};
	});
</script>

<svelte:head>
	<script src="https://js.pusher.com/7.0/pusher.min.js"></script>
</svelte:head>

<svelte:window
	on:keydown={(keyboardEvent) => {
		const detail = {
			metaKey: keyboardEvent.metaKey,
			key: keyboardEvent.key,
			keyCode: keyboardEvent.keyCode,
		};
		const keyPressed = filterKeypress(detail);

		if (keyPressed) {
			forwardKeypress(keyPressed);
		}
	}}
/>

<AppContainer>
	<div slot="alert">
		<Alert bind:this={alert} />
	</div>

	<div slot="main">
		{#if !isSignedIn}
			<div class="explanation">Enter your name to connect to live session:</div>
			<WordRow maxLetters={name.length || 1} letters={name || "_"} row={0} score={[]} />
		{:else}
			{#each guesses as guess}
				<WordRow maxLetters={5} letters={guess} row={0} score={[]} />
			{/each}

			<WordRow maxLetters={5} letters={guessLetters} row={0} score={[]} />

			<ul>
				{#if members}
					{#each Object.entries(members.members) as [id, user]}
						<li class:me={members.me.id === id}>
							{`${user.name}${sharedAppState.host === id ? " (host)" : ""}`}
						</li>
					{/each}
				{/if}
			</ul>

			{#if !channel}
				<div>
					<input bind:value={name} />
					<button on:click={connectToChannel}>Enter</button>
				</div>
			{/if}
		{/if}
	</div>

	<div slot="keyboard">
		<Alert absolute={false} bind:this={secondaryAlert} />
		<Keyboard
			disabled={(isSignedIn && !isYourTurn) || isSubmitting}
			highlights={[]}
			on:touchstart={({ detail }) => {
				const keyPressed = filterKeypress(detail);

				if (keyPressed) {
					forwardKeypress(keyPressed);
				}
			}}
		/>
	</div>
</AppContainer>

<style>
	.me {
		color: aqua;
	}

	.explanation {
		font-size: 1.5rem;
		max-width: 450px;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
	}
</style>

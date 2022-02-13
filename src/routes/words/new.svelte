<script>
	import WordRow from "$comp/common/WordRow.svelte";
	import Keyboard from "$comp/common/Keyboard.svelte";
	import AppBar from "$comp/common/AppBar.svelte";
	import { copyToClipboard } from "$lib/copyToClipboard";
	import Button from "$comp/common/Button.svelte";
	import Alert from "$comp/common/Alert.svelte";

	const wordLetterMin = 4;
	const wordLetterMax = 8;
	let alert;
	let word = "";
	let canEnterWord = true;
	let wordUrl;

	$: maxLetters = word.length;
	$: score = canEnterWord ? [] : Array(word.length).fill(2);

	async function getUrl() {
		const response = await fetch("/words/new", {
			method: "POST",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				word: word,
			}),
		});

		if (response.ok) {
			const data = await response.json();
			wordUrl = data.wordUrl;
		}
	}

	function handleKeypress({ key, keyCode, metaKey = false }) {
		if (metaKey) return;

		if (wordUrl && key === " ") {
			copyResults();
			return;
		}

		if (key === "Enter") {
			if (canEnterWord) {
				canEnterWord = false;
				getUrl();
			} else {
				reset();
			}

			return;
		}

		if (key === "Backspace") {
			word = word.substring(0, word.length - 1);
			return;
		}

		if (keyCode >= 65 && keyCode <= 90 && word.length < wordLetterMax) {
			word = word + key.toLowerCase();
		}
	}

	function copyResults() {
		copyToClipboard(wordUrl)
			.then(() => {
				alert.flashMessage("Copied to clipboard.", 1500);
			})
			.catch(() => {
				alert.flashMessage("Unable to copy to clipboard.", 1500);
			});
	}

	function reset() {
		word = "";
		canEnterWord = true;
		wordUrl = null;
	}
</script>

<svelte:window on:keydown={handleKeypress} />

<div class="container">
	<AppBar />

	<div class="gameContainer">
		<Alert bind:this={alert} />

		{#if !word}
			<div class="explanation">
				Enter a word ({wordLetterMin}-{wordLetterMax} letters) to challenge your friends!
			</div>
		{/if}

		<WordRow {maxLetters} letters={word} row="0" {score} />

		{#if !canEnterWord}
			<div class="urlInfo">
				<Button on:click={copyResults}>Copy link to word</Button>
				<p class="canGuess">Press Enter (↵) to start over.</p>
			</div>
		{/if}
	</div>

	<div class="keyboard">
		<Keyboard
			on:touchstart={({ detail }) => {
				handleKeypress(detail);
			}}
		/>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		touch-action: manipulation;
	}

	.gameContainer {
		flex: 1;
		padding-top: 4rem;
	}

	.explanation {
		font-size: 1.5rem;
		max-width: 450px;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
	}

	.keyboard {
		padding-bottom: 1rem;
		max-width: 450px;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
	}

	.urlInfo {
		padding-top: 1rem;
		text-align: center;
	}
</style>

<script>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { evaluateScore } from "$lib/evaluateScore";
	import { wordList } from "$lib/wordList";
	import { emojizeScores } from "$lib/emojizeScores";
	import WordRow from "./WordRow.svelte";
	import Keyboard from "./Keyboard.svelte";
	import JSConfetti from "js-confetti";
	import { setTestVariable, getTestVariable } from "$lib/cypressHelpers";
	import { copyToClipboard } from "$lib/copyToClipboard";
	import AppBar from "$comp/common/AppBar.svelte";
	import { init } from "svelte/internal";

	export let initialWord;

	const maxGuesses = 6;
	let jsConfetti;
	let answer = "";
	let guesses = [];
	let scores = [];
	let guessLetters = [];
	let message = null;
	let timeOut;

	function flashMessage(messageText, displayTime = 3000) {
		clearTimeout(timeOut);
		message = messageText;

		timeOut = setTimeout(() => {
			message = null;
		}, displayTime);
	}

	function copyResults() {
		const emojiResults = `Svelte Wordle ${guesses.length}/6\r` + emojizeScores(scores);

		copyToClipboard(emojiResults)
			.then(() => {
				flashMessage("Copied to clipboard.", 1500);
			})
			.catch(() => {
				flashMessage("Unable to copy to clipboard.", 1500);
			});
	}

	function reset(initialWord) {
		answer =
			initialWord ||
			getTestVariable("answer", wordList[Math.floor(Math.random() * wordList.length)]);
		guesses = [];
		scores = [];
		guessLetters = [];
	}

	$: wordLetterLimit = answer.length;
	$: hasGuessesLeft = guesses.length < maxGuesses;
	$: canGuess = guessLetters.length && guessLetters.length === wordLetterLimit && hasGuessesLeft;
	$: scoreSums = scores.map((scoreArray) => scoreArray.reduce((a, b) => a + b, 0));
	$: hasWon = scoreSums.includes(2 * answer.length);
	$: gameOver = hasWon || !hasGuessesLeft;
	$: keyboardHighlights = guesses.reduce((acc, guessRows, guessRowIndex) => {
		guessRows.forEach((guessLetter, guessLetterIndex) => {
			const keyValue = acc[guessLetter];
			const scoreKeyValue = scores[guessRowIndex][guessLetterIndex];

			if (!keyValue || keyValue < scoreKeyValue) {
				acc[guessLetter] = scoreKeyValue;
			}
		});
		return acc;
	}, {});

	$: {
		if (hasWon) {
			jsConfetti.addConfetti();
		}
	}

	function handleKeypress({ key, keyCode, metaKey = false }) {
		if (metaKey) return;

		if (gameOver) {
			if (key === "Enter") reset();
			return;
		}

		if (key === "Enter" && canGuess) {
			// TODO: verify guess is real word
			guesses = [...guesses, guessLetters];
			scores = [...scores, evaluateScore(guessLetters, answer)];
			guessLetters = [];
		}
		if (keyCode >= 65 && keyCode <= 90 && guessLetters.length < wordLetterLimit) {
			guessLetters = [...guessLetters, key.toLowerCase()];
		} else if (key === "Backspace") {
			guessLetters.pop();
			guessLetters = guessLetters;
		}
	}

	onMount(() => {
		setTestVariable("isLoaded", true);
		jsConfetti = new JSConfetti();
		reset(initialWord);
	});
</script>

<svelte:window on:keydown={handleKeypress} />

<div class="container">
	<AppBar />

	<div class="gameContainer">
		<div class="messageArea">
			{#if message}
				<p transition:fade={true}>{message}</p>
			{/if}
		</div>

		{#each guesses as guess, index}
			<WordRow letters={guess} maxLetters={wordLetterLimit} score={scores[index]} row={index} />
		{/each}

		{#if hasGuessesLeft && !hasWon}
			<WordRow letters={guessLetters} maxLetters={wordLetterLimit} row={guesses.length} />
		{/if}

		<div class="centered">
			{#if canGuess}
				<p class="canGuess">Press Enter (↵) to guess!</p>
			{/if}

			{#if !hasGuessesLeft && !hasWon}
				<p class="hasLost">
					The word was "{answer}".
				</p>
				<div class="buttonContainer">
					<button class="shareButton" on:click={copyResults}>Share</button>
					<button class="buttonPrimary resetButton" on:click={reset}>Play again</button>
				</div>
			{/if}

			{#if hasWon}
				<p class="hasWon">YOU WIN!</p>
				<div class="buttonContainer">
					<button class="shareButton" on:click={copyResults}>Share</button>
					<button class="buttonPrimary resetButton" on:click={reset}>Play again</button>
				</div>
			{/if}
		</div>
	</div>

	<div class="keyboard">
		<Keyboard
			highlights={keyboardHighlights}
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
	}

	.messageArea {
		display: flex;
		justify-content: center;
		font-size: 1rem;
		height: 4rem;
	}

	.messageArea p {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		background: #d7dadc;
		color: black;
	}

	.hasLost {
		padding-top: 0.5rem;
		margin: 0;
	}

	.buttonContainer {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
	}

	.centered {
		text-align: center;
	}

	.keyboard {
		padding-bottom: 1rem;
		max-width: 450px;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
	}

	button {
		border: 0;
		border-radius: 6px;
		font-size: 1.25rem;
		padding: 0.5rem;
		width: 8rem;
	}

	button:active {
		filter: brightness(85%);
		transform: scale(0.95);
	}

	.buttonPrimary {
		background: #538d4e;
		color: #d7dadc;
	}
</style>

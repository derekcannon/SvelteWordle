<script>
	import { onMount } from "svelte";
	import { evaluateScore } from "$lib/evaluateScore";
	import { wordList } from "$lib/wordList";
	import WordRow from "./WordRow.svelte";
	import Keyboard from "./Keyboard.svelte";
	import JSConfetti from "js-confetti";
	import { setTestVariable, getTestVariable } from "$lib/cypressHelpers";

	let jsConfetti;
	const maxGuesses = 6;
	let answer = "";
	let guesses = [];
	let scores = [];
	let guessLetters = [];

	function reset() {
		answer = getTestVariable("answer", wordList[Math.floor(Math.random() * wordList.length)]);
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

	function handleKeypress({ key, keyCode }) {
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
		reset();
	});
</script>

<svelte:window on:keyup={handleKeypress} />

<div class="container">
	<h1><span class="svelte">SVELTE</span> WORDLE</h1>

	<div class="game-container">
		{#each guesses as guess, index}
			<WordRow letters={guess} maxLetters={wordLetterLimit} score={scores[index]} row={index} />
		{/each}

		{#if hasGuessesLeft && !hasWon}
			<WordRow letters={guessLetters} maxLetters={wordLetterLimit} row={guesses.length} />
		{/if}

		<div class="centered">
			{#if canGuess}
				<p class="canGuess">Press enter (↵) to guess!</p>
			{/if}

			{#if !hasGuessesLeft && !hasWon}
				<p class="hasLost">
					The word was {answer}.
				</p>
				<button class="resetButton" on:click={reset}>Play again</button>
			{/if}

			{#if hasWon}
				<p class="hasWon">YOU WIN!</p>
				<button class="resetButton" on:click={reset}>Play again</button>
			{/if}
		</div>
	</div>

	<div class="keyboard">
		<Keyboard
			highlights={keyboardHighlights}
			on:keypress={({ detail }) => {
				handleKeypress(detail);
			}}
		/>
	</div>
</div>

<style>
	.svelte {
		color: #ff3e00b8; /* #ff3e00; */
	}

	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		touch-action: manipulation;
	}

	.game-container {
		flex: 1;
	}

	.centered {
		text-align: center;
	}

	.keyboard {
		padding-bottom: 1rem;
	}

	h1 {
		text-align: center;
		font-weight: 700;
		padding: 0 0 5rem;
		margin: 0;
	}
</style>

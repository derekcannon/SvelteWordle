<script>
	import { onMount } from "svelte";
	import JSConfetti from "js-confetti";
	import { evaluateScore } from "$lib/evaluateScore";
	import { wordList } from "$lib/wordList";
	import { emojizeScores } from "$lib/emojizeScores";
	import { setTestVariable, getTestVariable } from "$lib/cypressHelpers";
	import { copyToClipboard } from "$lib/copyToClipboard";
	import WordRow from "$comp/common/WordRow.svelte";
	import Keyboard from "$comp/common/Keyboard.svelte";
	import AppBar from "$comp/common/AppBar.svelte";
	import Alert from "$comp/common/Alert.svelte";
	import Button from "$comp/common/Button.svelte";
	import CopyIcon from "$comp/common/CopyIcon.svelte";
	import AppContainer from "$comp/common/AppContainer.svelte";

	export let initialWord;
	let shareGuesses = Boolean(initialWord);

	let alert;

	const maxGuesses = 6;
	let jsConfetti;
	let answer = "";
	let guesses = [];
	let scores = [];
	let guessLetters = [];

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
			if (key === "Enter") {
				reset();
			}
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

	function copyResults() {
		const emojiResults =
			`Svelte Wordle ${guesses.length}/6\r` + emojizeScores(scores, shareGuesses ? guesses : []);

		copyToClipboard(emojiResults)
			.then(() => {
				alert.flashMessage("Copied to clipboard.", 1500);
			})
			.catch(() => {
				alert.flashMessage("Unable to copy to clipboard.", 1500);
			});
	}

	function reset() {
		if (!initialWord && shareGuesses) {
			shareGuesses = false;
		}

		answer =
			initialWord ||
			getTestVariable("answer", wordList[Math.floor(Math.random() * wordList.length)]);
		initialWord = null;
		guesses = [];
		scores = [];
		guessLetters = [];
	}

	onMount(() => {
		setTestVariable("isLoaded", true);
		jsConfetti = new JSConfetti();
		reset();
	});
</script>

<svelte:window on:keydown={handleKeypress} />

<AppContainer>
	<div slot="alert">
		<Alert bind:this={alert} />
	</div>

	<div slot="main">
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
					<Button class="shareButton" on:click={copyResults}>
						<CopyIcon style="transform: scale(0.75);" />
						Share</Button
					>
					<Button primary class="resetButton" on:click={reset}>Play again</Button>
				</div>
			{/if}

			{#if hasWon}
				<p class="hasWon">YOU WIN!</p>
				<div class="buttonContainer">
					<Button class="shareButton" on:click={copyResults}>
						<CopyIcon style="transform: scale(0.75);" />
						Share</Button
					>
					{#if initialWord}
						<Button primary class="resetButton" on:click={reset}>Play more</Button>
					{:else}
						<Button primary class="resetButton" on:click={reset}>Play again</Button>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<div slot="keyboard">
		<Keyboard
			highlights={keyboardHighlights}
			on:touchstart={({ detail }) => {
				handleKeypress(detail);
			}}
		/>
	</div>
</AppContainer>

<style>
	.buttonContainer {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
	}

	.centered {
		text-align: center;
	}
</style>

<script>
	import { evaluateScore, wordList } from "$lib/utils";
	import WordRow from "./WordRow.svelte";

	const maxGuesses = 6;
	let answer, guesses, scores, guessLetters;

	function reset() {
		answer = wordList[Math.floor(Math.random() * wordList.length)];
		guesses = [];
		scores = [];
		guessLetters = [];
	}

	reset();

	$: wordLetterLimit = answer.length;
	$: hasGuessesLeft = guesses.length < maxGuesses;
	$: canGuess = guessLetters.length === wordLetterLimit && hasGuessesLeft;
	$: scoreSums = scores.map((scoreArray) => scoreArray.reduce((a, b) => a + b, 0));
	$: hasWon = scoreSums.includes(2 * answer.length);
	$: gameOver = hasWon || !hasGuessesLeft;

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
</script>

<svelte:window on:keyup={handleKeypress} />

{#each guesses as guess, index}
	<WordRow letters={guesses[index]} maxLetters={wordLetterLimit} score={scores[index]} />
{/each}

{#if hasGuessesLeft && !hasWon}
	<WordRow letters={guessLetters} maxLetters={wordLetterLimit} />
{/if}

{#if canGuess}
	<div class="centered">
		<p>Press enter to guess!</p>
	</div>
{/if}

{#if !hasGuessesLeft && !hasWon}
	<div class="centered">
		<p>
			The word was {answer}.
		</p>
		<button on:click={reset}> Play again </button>
	</div>
{/if}

{#if hasWon}
	<div class="centered">
		<p>YOU WIN!</p>
		<button on:click={reset}> Play again </button>
	</div>
{/if}

<style>
	.centered {
		text-align: center;
	}
</style>

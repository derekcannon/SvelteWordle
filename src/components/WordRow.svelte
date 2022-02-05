<script>
	export let maxLetters;
	export let letters;
	export let score = null;
</script>

<div class="wordContainer">
	{#each Array(maxLetters) as _, index}
		<div
			class="letterBox"
			class:nonOccurringLetter={score && score[index] === 0}
			class:correctPosition={score && score[index] === 2}
			class:correctLetter={score && score[index] === 1}
		>
			{#if letters[index]}
				{letters[index]}
			{/if}
		</div>
	{/each}
</div>

<style>
	.wordContainer {
		display: flex;
		justify-content: center;
		flex-wrap: nowrap;
		gap: 0.75rem;
		padding: 5px;
		font-size: 2rem;
	}

	.letterBox {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 3rem;
		height: 3rem;
		border: 1px solid #787c7e;
		box-sizing: border-box;
	}

	.nonOccurringLetter {
		background: #3a3a3c;
		border: none;
	}

	.correctPosition {
		background: #538d4e;
		border: none;
	}

	.correctLetter {
		background: #b59f3b;
		border: none;
	}
</style>

<script>
	export let maxLetters;
	export let letters;
	export let row;
	export let score = null;
</script>

<div class={`WordRow row-${row}`}>
	{#each Array(maxLetters) as _, index}
		<div
			class={`LetterBox box-${index}`}
			class:noMatchLetter={score && score[index] === 0}
			class:partialMatchLetter={score && score[index] === 1}
			class:exactMatchLetter={score && score[index] === 2}
		>
			{#if letters[index]}
				<span class="letter">
					{letters[index]}
				</span>
			{/if}
		</div>
	{/each}
</div>

<style>
	.WordRow {
		display: flex;
		justify-content: center;
		flex-wrap: nowrap;
		gap: 0.75rem;
		padding: 5px;
		font-size: 2rem;
	}

	.LetterBox {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 3rem;
		height: 3rem;
		border: 1px solid #787c7e;
		box-sizing: border-box;
		font-weight: 700;
	}

	.noMatchLetter {
		background: #3a3a3c;
		border: none;
	}

	.partialMatchLetter {
		background: #b59f3b;
		border: none;
	}

	.exactMatchLetter {
		background: #538d4e;
		border: none;
	}
</style>

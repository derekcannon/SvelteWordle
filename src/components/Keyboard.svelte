<script>
	import { createEventDispatcher } from "svelte";
	import { keyMappings } from "$lib/utils";

	export let highlights = {};

	const dispatch = createEventDispatcher();
</script>

{#each keyMappings as keyMappingRow}
	<div class="keyRow">
		{#each keyMappingRow as keyMapping}
			{@const highlight = highlights[keyMapping[1]]}
			<button
				class:nonOccurringLetter={highlight === 0}
				class:correctLetter={highlight === 1}
				class:correctPosition={highlight === 2}
				on:click={(event) => {
					event.target.blur();
					dispatch("keypress", {
						key: keyMapping[2] || keyMapping[1],
						keyCode: keyMapping[0],
					});
				}}>{keyMapping[1]}</button
			>
		{/each}
	</div>
{/each}

<style>
	.keyRow {
		display: flex;
		justify-content: center;
	}

	button {
		font-size: 1.5rem;
		max-width: 2.5rem;
		width: 2.5rem;
		margin: 3px;
		padding: 0.6rem;
		border: none;
		border-radius: 5px;
		background: #818384;
		color: white;
	}

	button:active {
		background: darkgray;
		transform: scale(0.9);
	}

	.nonOccurringLetter {
		background: #3a3a3c;
	}

	.correctPosition {
		background: #538d4e;
	}

	.correctLetter {
		background: #b59f3b;
	}
</style>

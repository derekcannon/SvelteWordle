<script>
	import { createEventDispatcher } from "svelte";
	import { keyMappings } from "$lib/keyMappings";

	export let highlights = {};

	const dispatch = createEventDispatcher();

	function dispatchTouchStart(keyMapping) {
		return dispatch("touchstart", {
			key: keyMapping[2] || keyMapping[1],
			keyCode: keyMapping[0],
		});
	}

	function handleKeypress(event, keyMapping) {
		event.preventDefault();
		event.target.blur(); // clear so button focus doesn't affect potential Enter key presses

		dispatchTouchStart(keyMapping);
	}
</script>

{#each keyMappings as keyMappingRow}
	<div class="keyRow">
		{#each keyMappingRow as keyMapping}
			{@const highlight = highlights[keyMapping[1]]}
			<button
				on:touchstart={(event) => handleKeypress(event, keyMapping)}
				on:click={(event) => handleKeypress(event, keyMapping)}
				><span
					class:noMatchLetter={highlight === 0}
					class:partialMatchLetter={highlight === 1}
					class:exactMatchLetter={highlight === 2}
					class="keyBox">{keyMapping[1]}</span
				></button
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
		background: none;
		border: none;
		margin: 0;
		padding: 2px;
		flex: 1;
	}

	.keyBox {
		display: block;
		font-size: 1.5rem;
		padding: 0.6rem;
		border-radius: 5px;
		background: #818384;
		color: white;
	}

	button:active {
		background: darkgray;
		transform: scale(0.9);
		-webkit-touch-callout: none;
	}

	.noMatchLetter {
		background: #3a3a3c;
	}

	.partialMatchLetter {
		background: #b59f3b;
	}

	.exactMatchLetter {
		background: #538d4e;
	}
</style>

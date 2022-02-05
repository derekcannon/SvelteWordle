<script>
	import { createEventDispatcher } from "svelte";
	import { keyMappings } from "$lib/utils";

	const dispatch = createEventDispatcher();
</script>

{#each keyMappings as keyMappingRow}
	<div class="keyRow">
		{#each keyMappingRow as keyMapping}
			<button
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
</style>

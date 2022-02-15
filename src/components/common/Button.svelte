<script>
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let primary = false;
	let className = null;
	export { className as class };

	$: formattedClass = className ? ` ${className}` : "";
</script>

<button class:primary class={`button${formattedClass}`} on:click={() => dispatch("click")}
	><slot /></button
>

<style>
	.button {
		display: flex;
		border: 0;
		border-radius: 6px;
		font-size: 1.25rem;
		padding: 0.5rem;
		text-decoration: none;
	}

	.button:active {
		filter: brightness(85%);
		transform: scale(0.95);
	}

	.primary {
		background: #538d4e;
		color: #d7dadc;
	}
</style>

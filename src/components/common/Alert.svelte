<script>
	import { fade } from "svelte/transition";

	export let absolute = true;
	let message;
	let timeout;

	export function flashMessage(messageText, displayTime = 3000) {
		clearTimeout(timeout);
		message = messageText;

		timeout = setTimeout(() => {
			message = null;
		}, displayTime);
	}

	export function set(messageText) {
		clearTimeout(timeout);
		message = messageText;
	}
</script>

<div class="container" class:absolute>
	{#if message}
		<p transition:fade={true}>{message}</p>
	{/if}
</div>

<style>
	.absolute {
		position: absolute;
		top: 3.75rem;
	}

	.container {
		width: 100%;
		display: flex;
		justify-content: center;
		font-size: 1rem;
	}

	p {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		background: #d7dadc;
		color: black;
		margin: 0;
	}
</style>

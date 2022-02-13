<script>
	import { fade } from "svelte/transition";
	let message;
	let timeout;

	export function flashMessage(messageText, displayTime = 3000) {
		clearTimeout(timeout);
		message = messageText;

		timeout = setTimeout(() => {
			message = null;
		}, displayTime);
	}
</script>

<div class="container">
	{#if message}
		<p transition:fade={true}>{message}</p>
	{/if}
</div>

<style>
	.container {
		position: absolute;
		top: 3.75rem;
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

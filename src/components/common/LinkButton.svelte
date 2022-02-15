<script>
	export let href;
	export let primary = false;
	export let external = false;

	let className = null;
	export { className as class };

	$: formattedClass = className ? ` ${className}` : "";
</script>

<a {href} class:primary class={`button${formattedClass}`} {...external ? { rel: "external" } : {}}>
	<slot />
</a>

<style>
	.button {
		display: flex;
		border: 0;
		border-radius: 6px;
		font-size: 1.25rem;
		padding: 0.5rem;
		text-decoration: none;
		background: #d7dadc;
		justify-content: center;
		text-decoration: none;
		color: black;
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

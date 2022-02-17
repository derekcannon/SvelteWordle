<script>
	import AppBar from "$comp/common/AppBar.svelte";
</script>

<div class="container">
	<AppBar />

	<div class="gameContainer">
		<slot name="alert" />

		<slot name="main" />
	</div>

	<div class="keyboard">
		<slot name="keyboard" />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		touch-action: manipulation;
	}

	.gameContainer {
		flex: 1;
		overflow: auto;
		padding-top: 4rem;
		padding-bottom: 1rem;
	}

	.keyboard {
		padding-bottom: 1rem;
		max-width: 450px;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
	}
</style>

<script>
	let newWord = "derek";
	import AppBar from "$comp/common/AppBar.svelte";
	import { copyToClipboard } from "$lib/copyToClipboard";

	export let wordUrl;
</script>

<AppBar />

<div class="container">
	{#if wordUrl}
		<div>Copy the link below to share:</div>
		<div class="encryptedWordContainer">
			<div class="wordUrl">{wordUrl}</div>
			<button
				class="button buttonPrimary"
				on:click={() => {
					copyToClipboard(wordUrl);
				}}>Copy</button
			>
		</div>
	{:else}
		<div>
			<label for="newWord">Enter a word (5-10 letters) to challenge your friends!</label>
			<div />
			<form class="buttonContainer" method="POST">
				<input
					name="word"
					type="text"
					autofocus
					id="newWord"
					bind:value={newWord}
					maxlength="10"
					minlength="4"
				/>
				<button type="submit" class="button buttonPrimary createLinkButton">Create link</button>
			</form>
		</div>
	{/if}
</div>

<style>
	.encryptedWordContainer {
		display: flex;
		gap: 0.5rem;
		max-width: 350px;
	}

	.wordUrl {
		background: #f9ffc1;
		color: rgb(54, 54, 54);
		font-size: 1rem;
		white-space: nowrap;
		overflow-y: scroll;
	}

	.container {
		margin-top: 3rem;
		margin-left: auto;
		margin-right: auto;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 350px;
	}

	label {
		font-size: 1rem;
		padding-bottom: 0.25rem;
		display: block;
	}

	input {
		font-size: 1.5rem;
		width: 100%;
		box-sizing: border-box;
		padding: 0.5rem;
	}

	.buttonContainer {
		display: flex;
		gap: 0.5rem;
	}

	.createLinkButton {
		min-width: 8rem;
	}

	.button {
		border: 0;
		border-radius: 6px;
		font-size: 1.25rem;
		padding: 0.5rem;
		width: 8rem;
		background: white;
		text-align: center;
		text-decoration: none;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.button:active {
		filter: brightness(85%);
		transform: scale(0.95);
	}

	.buttonPrimary {
		background: #538d4e;
		color: #d7dadc;
	}
</style>

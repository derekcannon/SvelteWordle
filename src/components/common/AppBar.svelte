<div class="container">
	<div class="sideButtonContainer" />

	<div>
		<a href="/" class="logo"><span class="svelte">SVELTE</span> WORDLE</a>
	</div>

	<div class="sideButtonContainer">
		<div class="tooltip">
			<a href="/words/new" class="miniButton">👥</a>
			<span class="tooltiptext">Challenge a friend</span>
		</div>
	</div>
</div>

<style>
	.tooltip {
		position: relative;
		display: inline-block;
	}

	.tooltip .tooltiptext {
		top: -5px;
		right: 105%;
		visibility: hidden;
		background-color: black;
		color: #fff;
		text-align: center;
		padding: 5px;
		border-radius: 6px;
		position: absolute;
		z-index: 1;
	}

	.tooltip:hover .tooltiptext {
		visibility: visible;
	}

	.miniButton {
		background: none;
		border: none;
		color: #d7dadc;
		font-size: 1.5rem;
		text-decoration: none;
		padding: 0.25rem;
	}

	.miniButton:hover {
		border: 1px solid #d7dadc;
		margin-top: -1px; /* prevent jumpy icons */
		border-radius: 4px;
	}

	.miniButton:active {
		filter: brightness(85%);
		transform: scale(0.95);
	}

	.container {
		display: flex;
		padding-top: 0.5rem;
		text-align: center;
		justify-content: space-between;
		padding-bottom: 0.25rem;
		border-bottom: 1px solid #3a3a3c;
	}

	.sideButtonContainer {
		width: 4rem;
	}

	.logo {
		font-size: 2rem;
		text-decoration: none;
		color: #d7dadc;
		font-weight: 700;
	}

	.svelte {
		color: #ff3e00b8;
	}
</style>

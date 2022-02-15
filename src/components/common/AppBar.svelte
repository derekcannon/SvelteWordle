<script>
	import PeopleIcon from "./PeopleIcon.svelte";
</script>

<div class="container">
	<div class="sideButtonContainer" />

	<div>
		<a href="/" class="logo"><span class="svelte">SVELTE</span> WORDLE</a>
	</div>

	<div class="sideButtonContainer">
		<div class="tooltip">
			<a href="/words/new" class="createWord">
				<PeopleIcon style="fill: #d7dadc" />
			</a>
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
		right: 120%;
		visibility: hidden;
		background-color: black;
		color: #d7dadc;
		text-align: center;
		padding: 5px;
		border-radius: 6px;
		border: 1px solid #d7dadc;
		position: absolute;
		z-index: 1;
	}

	.tooltip:hover .tooltiptext {
		visibility: visible;
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
		align-items: center;
		display: flex;
		justify-content: end;
		padding-right: 1rem;
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

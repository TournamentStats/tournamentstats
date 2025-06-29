<template>
	<div class="wrapper">
		<h1
			id="top-message"
			class="stylized-heading header-box skewed"
		>
			Amplify your <span class="main-color">custom</span> Tournament with <span class="main-color">Statistics</span>
		</h1>
		<ul class="side-list stylized-heading skewed">
			<li>Ever wondered who had ...</li>
			<li>The best K/D/A overall?</li>
			<li>Top CS/M of all Games?</li>
			<li>Most Pentakills?</li>
		</ul>
		<PrimaryButton
			id="create-tournament"
			class="stylized-heading"
			to="/tournament/create"
		>
			Statify your Tournament
		</PrimaryButton>
	</div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.wrapper {
	padding-top: 6rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
.main-color {
	color: var(--main-color);
}

.skewed {
	transform: skew(-0.75deg, -0.75deg) rotate(-0.75deg);
	transform-origin: top left;
}

.header-box {
	background-color: var(--background-tint-05);
}

#top-message {
	text-align: center;
	width: 100%;
	font-size: 3.5rem;
	margin: 0;
	padding: 0 1rem;
	line-height: 1.2;

	@media screen and (max-width: 768px) {
		font-size: 2.5rem;
	}
}

.side-list {
	list-style-type: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 0.5rem;
	width: fit-content;

	&>li {
		padding: 0.5rem 1.5rem;
		&:first-child {
			background-color: var(--main-color);
			width: 100%;
			text-align: center;
		}

		&:not(:first-child) {
			background-color: var(--background-tint-05);
			width: 90%;
			text-align: right;
		}
	}
}

#create-tournament {
	position: fixed;
	top: 60%;
	right: 10vw;
}

@media screen and (max-width: 768px) {
	.side-list {
		&>li {
			padding: 0.5rem 1rem;
		}
	}
	#create-tournament {
		position: static;
		align-self: center;
	}

}
</style>

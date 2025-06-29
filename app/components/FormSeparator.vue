<template>
	<div class="separator">
		<div class="left" />
		<span>
			<slot>or</slot>
		</span>
		<div class="right" />
	</div>
</template>

<style scoped lang="scss">
.separator {
	color: var(--light-accent);
	display: flex;
	flex-direction: row;
	gap: 0.5rem;
	align-items: center;
	margin: 0.5rem 0.5rem;

	>div {
		height: 2px;
		flex-grow: 1;
		background-color: var(--light-accent);
	}
}
</style>

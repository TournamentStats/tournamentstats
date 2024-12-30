<template>
	<form class="base-form">
		<slot />
	</form>
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
:slotted(h1), :slotted(h2) {
	margin: 0;
}

.base-form {
	display: flex;
	width: 350px;
	padding: 1.5rem 2rem;
	flex-direction: column;
	background-color: var(--background-tint-05);
	border-radius: 4px;
	box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}
</style>

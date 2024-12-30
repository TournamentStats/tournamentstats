<template>
	<BaseButton
		class="primary-button"
		:to="to"
	>
		<slot />
	</BaseButton>
</template>

<script lang="ts" setup>
const { to } = defineProps<{
	to?: string
}>()
</script>

<style scoped lang="scss">
.primary-button {
	min-height: 2.875rem;
	min-width: 4.735rem;
	padding: 0.75rem 1.5rem;
	border-radius: 0.25rem;
	color: inherit;
	background-color: var(--button-color);
	transition:
		background-color 0.3s ease,
		box-shadow 0.3s ease,
		color 0.3s ease;

	&:hover:enabled,
	&:hover:not(:disabled),
	&:focus-visible {
		background-color: color-mix(in srgb, var(--button-color), black 30%);
		box-shadow: 0px 4px 6px 0px color(from var(--shadow-color) srgb r g b / 0.3);
		color: white;
	}

	&:focus-visible {
		outline: 2px solid var(--button-color);
		outline-offset: 4px;
	}

	&:active:enabled,
	&:hover:not(:disabled) {
		background-color: color-mix(in srgb, var(--button-color), black 50%);
		box-shadow: 0px 6px 6px 0px color(from var(--shadow-color) srgb r g b / 0.3);
		color: white;
	}

	&:disabled {
		background-color: color-mix(in srgb, var(--button-color) 30%, #303030);
	}
}
</style>

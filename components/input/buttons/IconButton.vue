<template>
	<BaseButton class="icon-button">
		<span class="material-symbols-outlined">
			<slot />
		</span>
	</BaseButton>
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
.icon-button {
	--button-color: transparent;
	display: inline-grid;
	place-items: center;
	vertical-align: top;
	aspect-ratio: 1;
	padding: 0.25rem;
	border-radius: 100vh;
	background-color: var(--button-color);
	color: color-mix(in srgb, var(--font-color), black 20%);

	transition:
		background-color 0.3s ease,
		box-shadow 0.3s ease,
		color 0.3s ease;

	&:hover:enabled,
	&:focus-visible {
		background-color: color-mix(in srgb, var(--button-color), black 20%);
		box-shadow: 0px 4px 6px 0px color(from var(--shadow-color) srgb r g b / 0.3);
		color: white;
	}

	&:focus-visible {
		outline: 2px solid var(--main-color);
		outline-offset: 4px;
	}

	&:active:enabled {
		background-color: color-mix(in srgb, var(--button-color), black 30%);
		box-shadow: 0px 6px 6px 0px color(from var(--shadow-color) srgb r g b / 0.3);
	}

	&:disabled {
		background-color: color-mix(in srgb, var(--button-color) 30%, #303030);
	}
}
</style>

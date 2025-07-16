<template>
	<NuxtLink
		v-if="to"
		class="button"
		:to="to"
		enabled
	>
		<slot />
	</NuxtLink>
	<button
		v-else
		class="button"
		type="button"
	>
		<slot />
	</button>
</template>

<script lang="ts" setup>
const { to } = defineProps<{
	to?: string;
}>();
</script>

<style scoped lang="scss">
.button {
	--shadow-color: color-mix(in srgb, var(--button-color), black 90%);
	padding: 0;
	margin: 0;
	background: none;
	border: none;
	outline: none;
	cursor: pointer;

	&:disabled {
		cursor: not-allowed;
	}

}

a.button:hover {
	text-decoration: none;
}
</style>

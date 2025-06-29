<template>
	<NuxtLink
		v-if="to"
		:to="to"
		class="header-nav-element secondary-heading"
	>
		<slot />
	</NuxtLink>
	<div
		v-else
		class="header-nav-element secondary-heading"
	>
		<slot />
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	to?: string | null
}>()
</script>

<style scoped lang="scss">
.header-nav-element {
	cursor: pointer;
	color: var(--font-color);

  white-space: nowrap;

	&:hover {
		text-decoration: underline;
		text-decoration-color: var(--main-color);
		text-underline-offset: 4px;
		text-decoration-thickness: 2px;
	}
}
</style>

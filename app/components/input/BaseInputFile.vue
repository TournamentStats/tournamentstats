<template>
	<input
		:id="id"
		ref="input"
		class="custom-file-input"
		type="file"
		:accept="accept"
		@change="onFileChange"
	>
	<label
		tabindex="0"
		:for="id"
		@keyup.space.enter="input?.click()"
		@click.prevent="input?.click()"
	>
		<slot> Upload </slot>
	</label>
</template>

<script setup lang="ts">
const input = ref<HTMLInputElement>()

const file = defineModel<File | null>({ required: true })

defineProps<{
	id: string
	accept: string
	maxFileSizeMb: number
}>()

function onFileChange(e: Event) {
	file.value = (e.target as HTMLInputElement).files?.[0] ?? null
}
</script>

<style scoped>
.custom-file-input {
	display: none;
}
</style>

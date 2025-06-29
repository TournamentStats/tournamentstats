<template>
	<input
		:id="id"
		ref="input"
		class="custom-file-input"
		type="file"
		:accept="accept"
	>
	<label
		ref="transfer"
		:for="id"
		class="transfer"
		v-bind="$attrs"
	>
		<BaseButton
			class="upload-button"
			:class="{ 'file-on-top': isDragging }"
			@click.prevent="handleClick"
		>
			<div class="upload-text">
				<span class="material-symbols-outlined"> upload </span>
				<span class="text-label">{{ isDragging ? "Drop" : "Upload" }}</span>
			</div>
			<div class="supporting-text additional-info">max 2mb</div>
		</BaseButton>
	</label>
</template>

<script setup lang="ts">
import { UseFile } from '~/composables/useFile'

const input = useTemplateRef('input')
const transfer = useTemplateRef<HTMLElement>('transfer')

const file = defineModel<File | null>({ required: true })

defineProps<{
	id: string
	accept: string
	maxFileSizeMb: number
}>()

const { handleClick, isDragging } = UseFile(file, input, transfer)
</script>

<style scoped lang="scss">
.custom-file-input {
	display: none;
}

.transfer {
	display: inline-block;
	width: auto;
}

.text-label {
	width: 51px;
}

.upload-button {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	border-radius: 0.25rem;
	height: 100%;
	overflow: hidden;

	&:hover, &.file-on-top, &:focus-visible {
		.upload-text {
			color: var(--main-color);
		}
		>.additional-info {
			background-color: color-mix(in srgb, var(--main-color), black 30%);
		}
	}

	&:focus-visible {
		outline: 2px solid var(--main-color);
		outline-offset: 4px;
	}
}

.upload-text {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	background-color: var(--background-shade-40);
	padding: 0.5rem 0.75rem;
}

.additional-info {
	background-color: var(--main-color);
	width: 100%;
	padding: 0.13rem;
}
</style>

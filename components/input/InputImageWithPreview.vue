<template>
	<div class="image-input-wrapper">
		<input
			:id="id"
			ref="input"
			class="custom-file-input"
			type="file"
			accept="image/*"
		>
		<label
			ref="transfer"
			:for="id"
			class="transfer"
		>
			<img
				class="image-preview"
				:src="imageUrl"
				draggable="false"
			>
			<BaseButton
				class="upload-button"
				:class="{ expand: !customImageSet }"
				@click="handleClick"
			>
				<span class="material-symbols-outlined">upload</span>
				<span>{{ customImageSet ? "Edit" : "Upload" }} </span>
			</BaseButton>
			<BaseButton
				v-show="customImageSet"
				class="delete-button"
				@click="handleDelete"
			>
				<span class="material-symbols-outlined">Delete</span>
			</BaseButton>
			<div
				v-show="isDragging"
				class="drop-here"
			>
				Drop Image here
			</div>
		</label>
	</div>
</template>

<script setup lang="ts">
const PLACEHOLDER_IMAGE = '/images/team_logo_placeholder.png'

const input = ref<HTMLInputElement>()
const transfer = ref<HTMLButtonElement>()

const file = defineModel<File | null>({ required: true })
const imageUrl = ref<string>(PLACEHOLDER_IMAGE)

defineProps<{
	id: string
	maxFileSizeMb: number
}>()

watch(file, (newFile, oldFile) => {
	console.log('file changed', 'old:', oldFile, 'new: ', newFile)
	if (oldFile) {
		URL.revokeObjectURL(imageUrl.value)
	}
	if (newFile) {
		imageUrl.value = URL.createObjectURL(newFile)
	}
	else {
		imageUrl.value = PLACEHOLDER_IMAGE
	}
})

const customImageSet = computed(
	() => imageUrl.value !== PLACEHOLDER_IMAGE,
)

onUnmounted(() => {
	if (imageUrl.value) {
		URL.revokeObjectURL(imageUrl.value)
	}
})

function handleDelete() {
	file.value = null
}

const { handleClick, isDragging } = UseFile(file, input, transfer)
</script>

<style scoped lang="scss">
.image-input-wrapper {
	width: min-content;
}

.custom-file-input {
	display: none;
}

.transfer {
	display: inline-grid;
	width: 300px;
	height: calc(300px + 2.125rem);
	grid-template-columns: 1fr 2.125rem;
	grid-template-rows: 1fr 2.125rem;
	grid-template-areas:
        "image image"
        "upload delete";
	border-radius: 4px;
	overflow: hidden;
}

.image-preview {
	grid-area: image;
	height: 100%;
	width: 100%;
	display: block;
	object-fit: contain;
	background-color: var(--background-shade-40);
	outline: none;
	border: none;
	padding: 0;
}

.drop-here {
	grid-area: 1 / 1 / 3 / 3;
	background-color: color(from var(--background-shade-90) srgb r g b / 60%);
	display: flex;
	align-items: center;
	justify-content: center;
	outline: 1px dashed var(--light-accent);
	outline-offset: -1px;
	border-radius: inherit;
}

.upload-button {
	grid-area: upload;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	width: 100%;
	height: 100%;
	background-color: var(--background-tint-10);

	&.expand {
		grid-area: upload / upload / delete / delete;
	}

	&:focus-visible {
		transition: none;
		outline: 2px solid white;
		outline-offset: -2px;
	}

	&:hover, &:focus-visible {
		background-color: var(--background-tint-20);
	}

	&:active {
			background-color: var(--background-tint-30);
	}
}

.delete-button {
	grid-area: delete;
	padding: 0.25rem;
	background-color: var(--background-shade-20);
	height: 100%;
	transition: 0.2s background-color;

	&:enabled {
		&:focus-visible {
			transition: none;
			outline: 2px solid white;
			outline-offset: -2px;
		}

		&:hover, &:focus-visible {
			background-color: var(--error-color);
		}

		&:active {
			background-color: color-mix(in srgb, var(--error-color), white 10%);
		}
	}
}
</style>

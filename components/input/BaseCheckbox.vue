<template>
	<div :class="$attrs['class']">
		<input
			:id="props.id"
			v-model="$attrs['v-model']"
			type="checkbox"
			class="checkbox material-symbols-outlined"
		>
		<label :for="props.id">
			<slot />
		</label>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	inheritAttrs: false,
})
const props = defineProps<{
	id: string
}>()
</script>

<style scoped lang="scss">
.checkbox,
label {
	vertical-align: middle; // Aligns the elements in the middle
}

.checkbox {
	appearance: none;
	position: relative;
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 4px;
	background: var(--background-shade-60);
	margin-right: 0.5rem;

	&::before {
		content: 'check';
		position: absolute;
		left: 0;
		top: 0;
		font-size: 1.5rem;
		background-color: transparent;
		transform: scale(0);
		color: var(--font-color);
		border-radius: 4px;
	}

	&:checked::before {
		background-color: var(--main-color);
		transform: scale(1);
	}

	&:disabled {
		border-color: black;
		background: #ddd;
		color: rgb(75, 29, 29);
	}
}
</style>

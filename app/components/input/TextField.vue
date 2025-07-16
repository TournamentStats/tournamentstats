<template>
	<div
		class="input-wrapper"
		:class="{ error: error }"
		v-bind="{ class: attrsClass }"
	>
		<div class="text-box">
			<input
				:id="id"
				v-model="value"
				class="text-input"
				:type="showPassword ? 'text' : type"
				:required="required"
				v-bind="attrsWithoutClass"
			>
			<label
				:for="id"
				class="field-label stylized-heading"
			>
				{{ $attrs["placeholder"] }}
			</label>
			<div class="icon-container">
				<button
					v-if="type == 'password'"
					type="button"
					class="material-symbols-outlined show-password-button"
					:aria-label="showPassword ? 'Hide password' : 'Show password'"
					aria-live="polite"
					tabindex="-1"
					@click="toggleVisibility"
				>
					{{ showPassword ? "visibility_off" : "visibility" }}
				</button>
				<span
					v-if="error && type!='password'"
					class="error-icon material-symbols-outlined error"
				>error</span>
			</div>
		</div>
		<div class="supporting-text">
			{{ supportingText }}
		</div>
	</div>
</template>

<script setup lang="ts">
defineOptions({
	inheritAttrs: false,
});

const attrs = useAttrs();
const { 'class': attrsClass, ...attrsWithoutClass } = attrs;

const showPassword = ref(false);

function toggleVisibility() {
	showPassword.value = !showPassword.value;
}

const value = defineModel<string>({ required: true });
const error = defineModel<boolean>('error', { default: false });

withDefaults(
	defineProps<{
		id: string;
		type?: 'text' | 'email' | 'password' | 'tel' | 'url';
		required?: boolean;
		supportingText?: string | null;
	}>(),
	{
		type: 'text',
		required: false,
		supportingText: '',
	},
);

defineEmits<{
	'update:modelValue': [value: string];
}>();
</script>

<style scoped lang="scss">
.input-wrapper:disabled {
	cursor: not-allowed;
	opacity: 0.5;
}

.text-box {
	position: relative;
}

.text-input {
	width: 100%;
	height: 3.5rem;
	padding: 1.5rem 1rem 0.5rem 0.75rem;
	color: var(--font-color);
	border: none;
	background-color: var(--background-shade-40);
	border-radius: 4px;
	outline: none;

	&:focus {
		background-color: var(--background-shade-30);
	}

	&:focus-visible {
		outline: 2px solid var(--light-accent);
	}

	&::placeholder {
		pointer-events: none;
		user-select: none;
		color: transparent;
	}

	&~.field-label {
		background-color: transparent;
		cursor: text;
		position: absolute;
		display: block;
		margin-left: 0.75rem;
		font-size: 0.875rem;
		top: 0.3rem;
		transform: translateY(0);
		color: var(--light-accent);
		transition-duration: 0.1s;
		transition-property: top, transform, margin-left;
		transition-timing-function: ease-in-out;
	}

	&:placeholder-shown~.field-label {
		top: 50%;
		transform: translateY(-50%) translateX(0.25rem);
	}

	&:focus~.field-label {
		top: 0.3rem;
		margin-left: 0.75rem;
		transform: translateY(0) translateX(0);
	}
}

.supporting-text {
	width: calc(100% - 2rem);
	font-size: 0.875rem;
	margin: 0.25rem 1rem 0 1rem;
	overflow: hidden;
	max-height: 1000px;
	transition: 0.3s;
	transition-property: opacity, max-height, margin-top;

	&:empty {
		opacity: 0;
		max-height: 0;
		margin-top: 0;
	}
}

.icon-container {
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%);
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
}

.error-icon {
	pointer-events: none;
}

.input-wrapper.error {
	color: var(--error-color);

	.text-input {
		outline: 1px solid var(--error-color);
		padding-right: 52px;

		&:focus {
			outline: 2px solid var(--error-color);
		}
	}

	.field-label {
		color: var(--error-color);
	}

	.supporting-text {
		color: var(--error-color);
	}
}

.show-password-button {
	background: none;
	border: 0;
	padding: 0;
	margin: 0;
	color: inherit;
	cursor: pointer;
	font-weight: 200;
}
</style>

<template>
	<div class="debug">
		<div class="logo-text">
			<span class="tournament">Tournament</span>
			<span class="stats">Stats</span>
		</div>
		<TournamentStatsLogo />
		<h1>Colors</h1>
		<div class="colors">
			<div class="main">
				Main
			</div>
			<div class="light-accent">
				Light Accent
			</div>
			<div class="dark-accent">
				Dark Accent
			</div>
			<div class="transparent">
				Hover for Transition
			</div>
		</div>
		<h1>Logos</h1>
		<TournamentStatsLogo />

		<h1>Buttons:</h1>
		<BaseButton>BaseButton</BaseButton>
		<DiscordLoginButton />
		<IconButton>Search</IconButton>
		<PrimaryButton>PrimaryButton</PrimaryButton>
		<h1>Checkbox</h1>
		<BaseCheckbox id="checkbox">
			Check
		</BaseCheckbox>
		<h1>TextFields</h1>
		<BaseTextField
			id="Text1"
			v-model="text1"
			placeholder="Username"
			:supporting-text="text1"
		/>
		<BaseTextField
			id="Text2"
			v-model="text1"
			placeholder="Password"
			type="password"
		/>
		<BaseTextField
			id="Text3"
			v-model="text1"
			v-model:error="error"
			placeholder="Password"
			type="password"
		/>
		<TextField />
		<TextFieldInline />
		<h1>Upload</h1>
		<div>
			<InputFileButton
				id="fileupload1"
				v-model="file"
				accept="*/*"
				:max-file-size-mb="2"
			/>
		</div>
		<div>
			<InputImageWithPreview
				id="fileupload2"
				v-model="file2"
				:max-file-size-mb="2"
			/>
		</div>
		<h1>Containers:</h1>
		<BaseForm> Form </BaseForm>
	</div>
</template>

<script lang="ts" setup>
const text1 = ref('Hello World')
const error = ref(true)

const file = ref < File | null > (null)
const file2 = ref < File | null > (null)
</script>

<style>
.debug > * {
	margin-bottom: 1rem;
}
</style>

<style scoped lang="scss">
.colors {
	&>.main {
		background-color: var(--main-color);
	}

	&>.light-accent {
		background-color: var(--light-accent);
	}

	&>.dark-accent {
		background-color: var(--dark-accent);
	}

	&>.transparent {
		background-color: var(--main-color);
		transition: background-color 0.5s;

		&:hover {
			background-color: transparent;
		}
	}
}
</style>

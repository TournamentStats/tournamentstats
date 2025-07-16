<template>
	<div>
		<main class="create-page">
			<BaseForm class="create-tournament-form">
				<h1>Create Tournament</h1>
				<TextField
					id="tournament-name-field"
					v-model="tournamentName"
					class="input-text"
					placeholder="Tournament Name"
				/>
				<h2>Tournament Logo</h2>
				<InputImageWithPreview
					id="tournament-image"
					v-model="tournamentImage"
					class="tournament-image-wrapper"
					:max-file-size-mb="2"
				/>
				<BaseCheckbox
					id="private-checkbox"
					v-model="isPrivate"
					class="checkbox-wrapper"
				>
					Is this a private tournament?
				</BaseCheckbox>
				<PrimaryButton
					type="submit"
					@click.prevent="createTournament"
				>
					Create Tournament
				</PrimaryButton>
			</BaseForm>
		</main>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({
	middleware: 'authentication',
});

const tournamentName = ref('');
const tournamentImage = ref <File | null> (null);
const isPrivate = ref(false);

let imageId: string | undefined;

async function createTournament() {
	console.log(tournamentName, tournamentImage);
	await $fetch('/api/tournaments', {
		method: 'POST',
		headers: useRequestHeaders(['cookie']),
		body: {
			name: tournamentName.value,
			isPrivate: isPrivate.value,
			imageId: imageId,
		},
	});
}

watch(tournamentImage, async (new_image, _) => {
	if (new_image) {
		const response = await $fetch<{ imageId: string }>('/api/tournaments/images', {
			method: 'POST',
			headers: {
				'cookie': useRequestHeaders(['cookie']).cookie ?? '',
				'Content-Type': 'image/png',
			},
			body: tournamentImage.value,
		});
		imageId = response.imageId;
		console.log(imageId);
	}
	else {
		imageId = undefined;
	}
});
</script>

<style scoped lang="scss">
.create-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100vh;
	padding-top: 1rem;
	gap: 1rem;
}

h1,
h2,
.input-text,
.tournament-image-wrapper,
.checkbox-wrapper {
	margin-bottom: 1rem;
}
.create-tournament-form {
	width: 420px;
}

.tournament-image-wrapper {
	align-self: center;
}
</style>

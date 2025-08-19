<template>
	<div class="signup-page">
		<header>
			<TournamentStatsLogo height="90" />
		</header>
		<main>
			<BaseForm>
				<h1>Sign Up</h1>
				<p>
					Or <NuxtLink :to="{ path: '/login', query: { redirectTo: redirect } }">
						<span>Log In</span>
					</NuxtLink> instead
				</p>
				<TextField
					id="email-field"
					v-model="email"
					v-model:error="emailError"
					class="input-text"
					placeholder="Email"
				/>
				<TextField
					id="password-field"
					v-model="password"
					v-model:error="passwordError"
					class="input-text"
					placeholder="Password"
					type="password"
					:supporting-text="passwordErrorText"
				/>
				<PrimaryButton
					type="submit"
					@click.prevent="handleRegister"
				>
					Sign Up
				</PrimaryButton>
				<FormSeparator>or</FormSeparator>
				<DiscordLoginButton @click="handleDiscordLogin" />
			</BaseForm>
		</main>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'login' });

const redirectQuery = useRoute().query.redirectTo;
const redirect = (Array.isArray(redirectQuery) ? redirectQuery[0] : redirectQuery) ?? '/';

const supabase = useSupabaseClient();

const email = ref('');
const emailError = ref(false);

const password = ref('');
const passwordError = ref(false);

const passwordErrorText = ref('');

async function handleRegister() {
	emailError.value = false;
	passwordError.value = false;
	passwordErrorText.value = '';

	const { error } = await supabase.auth.signUp({
		email: email.value,
		password: password.value,
	});

	if (error) {
		passwordErrorText.value = error.message;
		passwordError.value = true;
		return;
	}
	await navigateTo(redirect);
}

async function handleDiscordLogin() {
	const { error } = await supabase.auth.signInWithOAuth({
		provider: 'discord',
		options: { redirectTo: 'https://localhost:3000/callback' }, // ?redirectTo=' + encodeURIComponent(redirect),
	});
	if (error) {
		console.error(error);
	}
}
</script>

<style scoped lang="scss">
.signup-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100vh;
	padding-top: 1rem;
	gap: 1rem;
}

.input-text {
	margin-bottom: 1rem;
}
</style>

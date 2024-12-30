<template>
	<div class="signup-page">
		<header>
			<TournamentStatsLogo height="90" />
		</header>
		<main>
			<BaseForm>
				<h1>Login</h1>
				<p>
					Or <NuxtLink :to="{ path: '/register', query: { redirectTo: route.query.redirectTo } }">
						Sign up
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
					@click.prevent="handleLogin"
				>
					Login
				</PrimaryButton>
				<FormSeparator>or</FormSeparator>
				<DiscordLoginButton @click="handleDiscordLogin" />
			</BaseForm>
		</main>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({
	layout: 'login',
})

const route = useRoute()
const redirect_url = route.query.redirectTo ?? route.redirectedFrom?.path ?? '/'

const supabase = useSupabaseClient()

const email = ref('')
const emailError = ref(false)

const password = ref('')
const passwordError = ref(false)

const passwordErrorText = ref('')

async function handleLogin() {
	emailError.value = false
	passwordError.value = false
	passwordErrorText.value = ''

	const { error } = await supabase.auth.signInWithPassword({
		email: email.value,
		password: password.value,
	})

	if (error) {
		passwordErrorText.value = error.message
		passwordError.value = true
		return
	}
}

async function handleDiscordLogin() {
	const { error } = await supabase.auth.signInWithOAuth({
		provider: 'discord',
		options: {
			redirectTo: 'http://localhost:3000/confirm?redirectTo=' + encodeURIComponent(redirect_url),
		},
	})
	if (error) {
		console.error(error)
	}
}

supabase.auth.onAuthStateChange((_, session) => {
	if (session) {
		navigateTo(redirect_url, { replace: true })
	}
})
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

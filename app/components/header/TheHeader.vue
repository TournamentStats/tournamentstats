<template>
	<header class="header">
		<TournamentStatsLogo class="logo-big" />
		<div class="header-nav-elements">
			<HeaderNavElement
				v-if="user"
				:to="`/user/${user.id}/tournaments`"
				class="tournaments"
			>
				My Tournaments
			</HeaderNavElement>
			<HeaderNavElement
				v-if="!user"
				to="/login"
				class="auth"
			>
				Log in
			</HeaderNavElement>
			<HeaderNavElement
				v-if="user"
				class="auth"
				@click="logout"
			>
				Log out
			</HeaderNavElement>
		</div>
	</header>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

onMounted(() => {
	console.log(user.value);
});

async function logout() {
	await supabase.auth.signOut();
}
</script>

<style scoped lang="scss">
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 2rem;
	background-color: var(--background-shade-30);
	width: 100%;
}

.header-nav-elements {
	display: flex;
	gap: 2rem;
	overflow: hidden;
}
</style>

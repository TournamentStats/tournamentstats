<template>
	<div>
		<div> logged in as: {{ user?.email }}</div>
		<div>
			<p>
				Redirecting...
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
console.log('confirm');
const user = useSupabaseUser();

const redirectQuery = useRoute().query.redirectTo;
const redirect = Array.isArray(redirectQuery) ? redirectQuery[0] : redirectQuery;

watch(user, async () => {
	if (user.value) {
		await navigateTo(redirect);
	}
}, { immediate: true });
</script>

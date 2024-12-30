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
console.log('confirm')
const user = useSupabaseUser()

const redirect = useRoute().query.redirectTo ?? '/'

watch(user, () => {
	if (user.value) {
		navigateTo(redirect)
	}
}, { immediate: true })
</script>

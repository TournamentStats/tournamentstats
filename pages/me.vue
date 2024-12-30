<template>
	<div>
		{{ user }}
	</div>
</template>

<script lang="ts" setup>
definePageMeta({
	middleware: 'authentication',
})
const user = ref(null)
const { data } = await useFetch('/api/me', {
	headers: useRequestHeaders(['cookie']),
})

user.value = data
</script>

<style>

</style>

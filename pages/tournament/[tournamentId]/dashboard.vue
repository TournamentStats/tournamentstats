<template>
	<NuxtPage />
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ['authentication', 'user-authorization'],
})
</script>

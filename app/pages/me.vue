<template>
	<div>
		{{ user.data }}
	</div>
</template>

<script lang="ts" setup>
import type { User } from '@supabase/supabase-js';

definePageMeta({ middleware: 'authentication' });

const user = await useFetch<User>('/api/me', { headers: useRequestHeaders(['cookie']) });
</script>

<style>

</style>

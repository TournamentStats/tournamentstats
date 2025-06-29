<template>
	<div class="default-layout">
		<TheHeader />
		<slot />
	</div>
</template>

<script lang="ts" setup></script>

<style>
.default-layout {
	height: 100vh;
}
</style>

<template>
	<footer class="footer">Credits to <a href="https://pokeapi.co/">PokeAPI</a> for saving me a lot of trouble and to <a href="Serebii.net">Serebii</a>For more of the location information</footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	setup() {
		return {};
	},
});
</script>

<style lang="scss" scoped>
.footer {
	height: 32px;
	font-size: 0.75rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}
</style>

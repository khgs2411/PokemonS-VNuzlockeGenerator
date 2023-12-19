<template>
	<div v-if="loading" class="loading">
		<div class="spinner">
			<Icon icon="game-icons:pokecog" width="100" height="100" />
		</div>
	</div>
</template>

<script lang="ts">
import { Icon } from "@iconify/vue";
import { computed, defineComponent } from "vue";
import { useDataStore } from "../common/store/data.store";

export default defineComponent({
	name: "Loading",
	components: {
		Icon,
	},
	setup() {
		const store = useDataStore();
		const loading = computed(() => store.loading);
		return {
			loading,
		};
	},
});
</script>

<style lang="scss" scoped>
.loading {
	width: 100%;
	height: 100%;
	background: #000;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
	opacity: 0.8;
	display: flex;
	justify-content: center;
	align-items: center;
}

/* Apply the animation to an element */
</style>

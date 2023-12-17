<template>
	<nav class="layout-header">
		<div class="left">
			<div class="view"></div>
		</div>
		<div class="right"></div>
	</nav>
</template>

<script lang="ts">
import SelectButton from "primevue/selectbutton";
import { Ref, defineComponent, ref } from "vue";

export default defineComponent({
	name: "LayoutHeader",
	components: {
		SelectButton,
	},
	setup() {
		const view: Ref<"map" | "encounters"> = ref("encounters"); // "map" | "encounters
		const viewOptions = ref([
			{ label: "Show Encounters", value: "encounters" },
			{ label: "Show Map", value: "map" },
		]);

		return {
			view,
			viewOptions,
		};
	},
});
</script>

<style lang="scss" scoped>
.layout-header {
	height: 32px;
	width: 100vw;
	background: #1e1e1e;
	border-bottom: 1px solid #383838;
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.left {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: center;
		padding-left: 0.5rem;
	}
	.right {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: center;
		padding-right: 0.5rem;
	}
}
</style>

<template>
	<nav class="layout-header">
		<div class="left">
			<div @click="showSettings" class="header-layout-element">Settings <Icon icon="mdi:cog" width="20px" /></div>
			<Divider style="margin-right: 0" layout="vertical"></Divider>
			<div class="change-view">
				<SelectButton option-label="label" option-value="value" :options="viewOptions" v-model="view"></SelectButton>
			</div>
		</div>
		<div class="right">
			<div v-tooltip.bottom="'View Team'" @click="showTeam" class="header-layout-element">
				<Icon icon="mdi:pokeball" width="20px"></Icon>
				<div class="text">Team: {{ teamCount }} / 6</div>
			</div>
			<Divider layout="vertical"></Divider>
			<div class="caught header-layout-element">
				<Icon icon="ic:baseline-catching-pokemon" :rotate="90" width="20px" />
				<div class="text">Caught: {{ caughtCount }}</div>
			</div>
			<Divider layout="vertical"></Divider>
			<div class="caught header-layout-element">
				<Icon icon="ic:baseline-catching-pokemon" :rotate="90" width="20px" />
				<div class="text">Available Encounters: {{ currentArea?.availableEncounters }}</div>
			</div>
			<Divider layout="vertical"></Divider>
		</div>
	</nav>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import SelectButton from "primevue/selectbutton";
import { computed, defineComponent, ref } from "vue";
import { useSettingsStore } from "../common/store/settings.store";
import { useDataStore } from "../common/store/data.store";
import { Icon } from "@iconify/vue";
import Divider from "primevue/divider";

export default defineComponent({
	name: "LayoutHeader",
	components: {
		SelectButton,
		Icon,
		Divider,
	},
	setup() {
		const store = useDataStore();
		const settings = useSettingsStore();
		const { view } = storeToRefs(settings);
		const team = computed(() => store.team);
		const caught = computed(() => store.caught);
		const dead = computed(() => store.dead);
		const teamCount = computed(() => team.value.length);
		const caughtCount = computed(() => caught.value.length + dead.value.length);
		const currentArea = computed(() => store.currentArea);
		const viewOptions = ref([
			{ label: "Show Map", value: "map" },
			{ label: "Show Encounters", value: "encounters" },
		]);

		function showTeam() {
			if (!currentArea.value) return;
			settings.showTeam = !settings.showTeam;
		}

		function showSettings() {
			settings.sidebar = !settings.sidebar;
		}
		return {
			teamCount,
			caught,
			caughtCount,
			view,
			viewOptions,
			currentArea,
			showTeam,
			showSettings,
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
	align-items: center;
	font-size: 0.75rem;

	.left,
	.right {
		width: fit-content;
		flex: 1;
		overflow: hidden;
		overflow-x: auto;
		display: flex;
		// gap: 0.5rem;
		align-items: center;
		// justify-content: center;
	}

	.left {
		padding-left: 0.5rem;
	}
	.right {
		flex-direction: row-reverse;
		padding-right: 0.5rem;
	}
	.change-view {
		// width: fit-content;
		&:deep() {
			.p-button {
				font-size: 0.75rem;
				height: 31px;
				border: none;
				border-radius: 0;
			}
		}
	}
	.header-layout-element {
		height: 100%;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		cursor: pointer;
		width: fit-content;
		white-space: nowrap;
	}
}
</style>

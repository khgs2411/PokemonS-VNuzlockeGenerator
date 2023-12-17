import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	base: "https://khgs2411.github.io/PokemonS-VNuzlockeGenerator/",
	server: {
		port: 8000,
	},
});

import { defineStore, acceptHMRUpdate } from "pinia";
import { IRegionResponse } from "../types/pokedex.type";
import { Ref, ref } from "vue";
import { ERegions } from "../enums/regions";
import Pokedex from "../../services/pokedex.service";
import Lib from "../../services/lib.services";

export const usePokdexStore = defineStore("pokdex.store", () => {
  const version: Ref<"scarlet" | "violet"> = ref("scarlet");
  const region: Ref<IRegionResponse | undefined> = ref();
  const area: Ref<string | undefined> = ref();
  const pokemon: Ref<string | undefined> = ref();

  async function init() {
    const cookie = localStorage.getItem("pokedex");
    if (Lib.isNil(cookie)) {
      await getRegion();
    } else {
      initFromCookie(cookie);
    }
  }

  function initFromCookie(cookie: string) {
    version.value = JSON.parse(cookie).version;
    region.value = JSON.parse(cookie).region;
    area.value = JSON.parse(cookie).area;
    pokemon.value = JSON.parse(cookie).pokemon;
    pokemon.value = "pikachu";
  }

  async function getRegion(name: ERegions = ERegions.PALDEA) {
    if (!Lib.isNumpty(region.value)) return;
    const response = await Pokedex.Region(name);
    region.value = response;
  }

  async function getLocationArea() {
    if (Lib.isNumpty(area.value)) return;
    const response = await Pokedex.LocationArea(area.value as string);
    console.log(response);
  }
  async function getLocation(all: boolean = false) {
    const response = await Pokedex.Location(all ? "" : area.value ?? "");
    console.log(response);
  }

  async function getPokemon(all: boolean = false) {
    const response = await Pokedex.Pokemon(all ? "" : pokemon.value ?? "");
    console.log(response);
  }
  async function getPokemonEncounters(all: boolean = false) {
    const response = await Pokedex.getPokemonEncounters(
      all ? "" : pokemon.value ?? ""
    );
    console.log(response);
  }

  return {
    version: version,
    region: region,
    area: area,
    pokemon: pokemon,
    init: init,
    getRegion: getRegion,
    getLocationArea: getLocationArea,
    getLoaction: getLocation,
    getPokemon: getPokemon,
    getPokemonEncounters: getPokemonEncounters,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePokdexStore, import.meta.hot));
}

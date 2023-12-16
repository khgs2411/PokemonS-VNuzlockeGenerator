import Lib from "../../services/lib.services";
import { PokdexApiOptions } from "../types/api.types";

const endpoints = {
  region: "https://pokeapi.co/api/v2/region/",
  location: "https://pokeapi.co/api/v2/location/",
  locationArea: "https://pokeapi.co/api/v2/location-area/",
  pokemon: "https://pokeapi.co/api/v2/pokemon/",
  encounters_suffix: "/encounters",
};

export default endpoints;

export function get_url(
  endpoint: "region" | "locationArea" | "location" | "pokemon",
  name?: string,
  options?: PokdexApiOptions
): string {
  console.log(endpoint, name, options);
  let URL: string = `${endpoints[endpoint]}`;
  if (name) {
    URL += `${name}`;
  }
  if (options && !Lib.isNumpty(options)) {
    URL += `?limit=${options?.limit}&offset=${options?.offset}`;
  }
  if (!options && !name) {
    URL += `?limit=850&offset=0`;
  }
  if (Lib.isEmpty(URL))
    throw new Error("Invalid URL generated from buildEndpoint()");
  return URL;
}

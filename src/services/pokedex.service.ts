import { AxiosResponse } from "axios";
import api from "../common/api/api";
import { PokdexApiOptions } from "../common/types/api.types";
import { IRegionResponse } from "../common/types/pokedex.type";
import { get_url } from "../common/consts/endpoints";
import Lib from "./lib.services";
import endpoints from "../common/consts/endpoints";

class Pokedex {
  public static async Region(name: string, options?: PokdexApiOptions) {
    try {
      const response: AxiosResponse<IRegionResponse> = await api.get(
        get_url("region", name, options)
      );
      if (Lib.isNumpty(response.data))
        throw new Error("Invalid data received from API.");
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  public static async Location(name: string, options?: PokdexApiOptions) {
    try {
      const response: AxiosResponse<any> = await api.get(
        get_url("location", name, options)
      );
      if (Lib.isNumpty(response.data))
        throw new Error("Invalid data received from API.");
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  public static async Pokemon(name?: string, options?: PokdexApiOptions) {
    try {
      const response: AxiosResponse<any> = await api.get(
        get_url("pokemon", name, options)
      );
      if (Lib.isNumpty(response.data))
        throw new Error("Invalid data received from API.");
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  public static async LocationArea(name: string, options?: PokdexApiOptions) {
    try {
      const response: AxiosResponse<any> = await api.get(
        get_url("locationArea", name, options)
      );
      if (Lib.isNumpty(response.data))
        throw new Error("Invalid data received from API.");
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  public static async getPokemonEncounters(
    name: string,
    options?: PokdexApiOptions
  ) {
    try {
      const response: AxiosResponse<any> = await api.get(
        get_url("pokemon", name, options) + endpoints.encounters_suffix
      );
      if (Lib.isNumpty(response.data))
        throw new Error("Invalid data received from API.");
      return response.data;
    } catch (err) {
      throw err;
    }
  }
}

export default Pokedex;

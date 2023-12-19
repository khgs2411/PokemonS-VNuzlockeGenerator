import Lib from "./lib.services";
class CacheService {
	public static debouncedLocalStorageSave = Lib.debounce((key: string, data: any) => {
		const encodedState = btoa(encodeURIComponent(JSON.stringify(data)));
		localStorage.setItem(key, encodedState);
	}, 200);

	public static resetCache(key: string) {
		localStorage.getItem(key) && localStorage.removeItem(key);
	}
}

export default CacheService;

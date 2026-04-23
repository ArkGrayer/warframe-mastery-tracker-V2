import { WarframeApiService } from "@/infrastructure/api/warframeApiService";
import { useItemStore } from "../stores/itemStore";
import { get, set } from "idb-keyval";
import type { Item } from "@/domain/entities/Item";

const CACHE_KEY_ITEMS = "wf_items_cache";
const CACHE_KEY_GLYPHS = "wf_glyphs_cache";
const CACHE_KEY_TIME = "wf_cache_timestamp";
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

export const fetchItemsUseCase = async () => {
  const itemStore = useItemStore.getState();
  const apiService = new WarframeApiService();

  itemStore.setLoading(true);
  itemStore.setError(null);

  try {
    const cachedTime = await get<number>(CACHE_KEY_TIME);
    const now = Date.now();
    const isCacheValid = cachedTime && (now - cachedTime < CACHE_EXPIRATION);

    if (isCacheValid) {
      const cachedItems = await get<Item[]>(CACHE_KEY_ITEMS);
      const cachedGlyphs = await get<Item[]>(CACHE_KEY_GLYPHS);

      if (cachedItems && cachedGlyphs) {
        console.log("Warframe Mastery Tracker: Carregando dados do Cache Local (IndexedDB)");
        itemStore.setItems(cachedItems, cachedGlyphs);
        itemStore.setLoading(false);
        return;
      }
    }

    console.log("Warframe Mastery Tracker: Sincronizando com API Oficial (Primeira vez ou Cache expirado)");
    const items = await apiService.fetchAllItems();
    const glyphs = await apiService.fetchAllGlyphs();

    await set(CACHE_KEY_ITEMS, items);
    await set(CACHE_KEY_GLYPHS, glyphs);
    await set(CACHE_KEY_TIME, now);

    itemStore.setItems(items, glyphs);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch items";
    itemStore.setError(message);
  } finally {
    itemStore.setLoading(false);
  }
};

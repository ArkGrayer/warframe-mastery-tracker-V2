import { WarframeApiService } from "@/infrastructure/api/warframeApiService";
import { useItemStore } from "../stores/itemStore";

export const fetchItemsUseCase = async () => {
  const itemStore = useItemStore.getState();
  const apiService = new WarframeApiService();

  itemStore.setLoading(true);
  itemStore.setError(null);

  try {
    const items = await apiService.fetchAllItems();
    const glyphs = await apiService.fetchAllGlyphs();
    itemStore.setItems(items, glyphs);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch items";
    itemStore.setError(message);
  } finally {
    itemStore.setLoading(false);
  }
};

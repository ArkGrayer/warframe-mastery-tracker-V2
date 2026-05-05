import { WarframeApiService } from "@/infrastructure/api/warframeApiService";
import { useItemStore } from "../stores/itemStore";
import { get, set } from "idb-keyval";

export const fetchItemDetailsUseCase = async (itemName: string) => {
  const itemStore = useItemStore.getState();

  // 1. Check if already in store
  if (itemStore.itemDetails[itemName]) {
    return;
  }

  // 2. Check if currently pending
  if (itemStore.pendingRequests.has(itemName)) {
    return;
  }

  itemStore.addPendingRequest(itemName);

  try {
    const cacheKey = `wf_item_${itemName}`;
    
    // 3. Check IndexedDB
    const cachedDetails = await get<{ imageName?: string; totalExperience?: number }>(cacheKey);
    
    if (cachedDetails) {
      itemStore.setItemDetails(itemName, cachedDetails);
      return;
    }

    // 4. Fetch from API
    const apiService = new WarframeApiService();
    const details = await apiService.fetchItemDetails(itemName);

    if (details) {
      // 5. Save to IndexedDB and store
      await set(cacheKey, details);
      itemStore.setItemDetails(itemName, details);
    }

  } catch (error) {
    console.error(`Error fetching details for ${itemName}:`, error);
  } finally {
    const finalStore = useItemStore.getState();
    finalStore.removePendingRequest(itemName);
  }
};

import type { Item } from "../entities/Item";

export interface IItemRepository {
  fetchAllItems(): Promise<Item[]>;
  fetchAllGlyphs(): Promise<Item[]>;
}

import type { IItemRepository } from "../../domain/repositories/IItemRepository";
import type { Item } from "../../domain/entities/Item";
import { EXCLUDED_NAMES, CATEGORY_MAP } from "../../domain/valueObjects/CategoryMap";

export const IMAGE_BASE_URL = "https://cdn.warframestat.us/img/";

export class WarframeApiService implements IItemRepository {
  private readonly API_URL = "https://api.warframestat.us/items";

  async fetchAllItems(): Promise<Item[]> {
    const data = await this.fetchFromApi();
    const { items } = this.processData(data);
    return items;
  }

  async fetchAllGlyphs(): Promise<Item[]> {
    const data = await this.fetchFromApi();
    const { glyphs } = this.processData(data);
    return glyphs;
  }

  private async fetchFromApi(): Promise<any[]> {
    const response = await fetch(this.API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch items from Warframe API");
    }
    return response.json();
  }

  private processData(data: any[]): { items: Item[]; glyphs: Item[] } {
    const items: Item[] = [];
    const glyphs: Item[] = [];

    data.forEach((rawItem: any) => {
      if (rawItem.category === "Glyphs") {
        glyphs.push(this.mapToItem(rawItem));
        return;
      }

      if (!rawItem.masterable) return;

      if (EXCLUDED_NAMES.includes(rawItem.name)) return;

      if (!CATEGORY_MAP[rawItem.category]) return;

      const normalizedItem = this.normalizeItemData(rawItem);
      
      items.push(normalizedItem);
    });

    // Sort by name
    const sorter = (a: Item, b: Item) => a.name.localeCompare(b.name);
    items.sort(sorter);
    glyphs.sort(sorter);

    return { items, glyphs };
  }

  private normalizeItemData(rawItem: any): Item {
    const item: Item = this.mapToItem(rawItem);

    // Normalization logic
    if (rawItem.productCategory === "MechSuits") {
      item.category = "Necramech";
    } else if (rawItem.productCategory === "SentinelWeapons") {
      item.category = "SentinelWeapons";
    } else if (rawItem.name.includes("Moa") && !rawItem.name.includes("Prisma")) {
      item.category = "MOA";
    } else if (rawItem.name.includes("Hound")) {
      item.category = "Hound";
    }

    // Pets subType
    if (item.category === "Pets") {
      if (rawItem.name.includes("Kubrow")) item.subType = "Kubrow";
      else if (rawItem.name.includes("Kavat")) item.subType = "Kavat";
      else if (rawItem.name.includes("Vulpaphyla")) item.subType = "Vulpaphyla";
      else if (rawItem.name.includes("Predasite")) item.subType = "Predasite";
    }

    // Amps
    if (rawItem.category === "Amp" || rawItem.productCategory === "OperatorAmps") {
      item.category = "Amps";
      item.subType = rawItem.name.includes("Prism") ? "Prism" : "Amp";
    }

    return item;
  }

  private mapToItem(rawItem: any): Item {
    return {
      uniqueName: rawItem.uniqueName,
      name: rawItem.name,
      category: rawItem.category,
      productCategory: rawItem.productCategory,
      imageName: rawItem.imageName,
      masterable: rawItem.masterable ?? false,
      totalExperience: rawItem.totalExperience,
    };
  }
}

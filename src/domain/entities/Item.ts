export interface Item {
  uniqueName: string;
  name: string;
  category: string;
  productCategory?: string;
  imageName?: string;
  masterable: boolean;
  totalExperience?: number;
  subType?: string; // Para Pets e Amps, ex: "Kubrow", "Kavat", "Prism"
}

import { Save } from "../../utils/save";
import type { AllEmbedDatasetArray } from "./kuronime.type";

export class KuronimeRepository {
  async saveToJson(data: AllEmbedDatasetArray, slug: string) {
    const savedDir = await new Save("Kuronime", slug, data).toJSON();
    console.log(`Data saved successfully! ${savedDir}`);
  }
}

import { Save } from "../../utils/save";
import type { AllEmbedDatasetArray } from "./kuronime.type";

export class KuronimeRepository {
  async saveToJson(data: AllEmbedDatasetArray) {
    const savedDir = await new Save("Kuronime", data).toJSON();
    console.log(`Data saved successfully! ${savedDir}`);
  }
}

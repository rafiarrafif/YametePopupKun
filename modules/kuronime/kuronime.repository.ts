import { Save } from "../../utils/save";

export class KuronimeRepository {
  async saveToJson(data: unknown, slug: string) {
    const savedDir = await new Save(
      `./output/Kuronime/episodes/${slug}/`,
      data,
    ).toJSON();
    console.log(`Data saved successfully! ${savedDir}`);
  }

  async bulkSaveToJson(data: unknown, animeName: string) {
    const savedDir = await new Save(
      `./output/Kuronime/batch/${animeName}/`,
      data,
    ).toJSON();
    console.log(`Data saved successfully! ${savedDir}`);
  }
}

import { browser } from "../../core/browser";
import config from "../../config.json";

export class KuronimeService {
  async scrapeAnimeData(slug: string) {
    const referenceUrl = config.platforms.find(
      (p) => p.name === "Kuronime",
    )?.slug_url;
    if (!referenceUrl) throw new Error("Kuronime URL not found in config.");
    const targetUrl = referenceUrl.replace("{slug}", slug);

    const page = await browser.newPage();
    await page.goto(targetUrl);
  }
}

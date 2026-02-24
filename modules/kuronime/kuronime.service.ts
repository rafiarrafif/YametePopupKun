import { browser } from "../../core/browser";
import config from "../../config.json";
import type { AllEmbedDatasetArray } from "./kuronime.type";

export class KuronimeService {
  async scrapeAnimeData(slug: string) {
    const referenceUrl = config.platforms.find(
      (p) => p.name === "Kuronime",
    )?.slug_url;
    if (!referenceUrl) throw new Error("Kuronime URL not found in config.");
    const targetUrl = referenceUrl.replace("{slug}", slug);

    const page = await browser.newPage();
    await page.goto(targetUrl);

    const miskinMintaMinta = page.locator(
      "div#popup_box_donasi div.close-button",
    );
    await miskinMintaMinta.click();
    await page.click("div#close-button");

    await page.waitForFunction(() => {
      const select = document.querySelector("#mirrorList");
      return select && select.querySelectorAll("option").length > 1;
    });

    const options = await page.$$eval(
      "#mirrorList option",
      (opts: HTMLOptionElement[]) =>
        opts
          .filter((o: HTMLOptionElement) => !o.disabled && o.value)
          .map((o: HTMLOptionElement) => ({
            value: o.value,
            text: o.textContent?.trim() || "",
          })),
    );

    const result: AllEmbedDatasetArray = [];
    for (const option of options) {
      await page.selectOption("#mirrorList", option.value, {
        force: true,
      });
      await page.waitForFunction(() => {
        const iframe: HTMLIFrameElement | null =
          document.querySelector("iframe#iframedc");
        return iframe && iframe.src && iframe.src.startsWith("https");
      });

      const src = await page.getAttribute("iframe#iframedc", "src");
      if (src) {
        result.push({ name: option.text, value: option.value, url: src });
      }
    }
    return result;
  }
}

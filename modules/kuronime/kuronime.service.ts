import { browser } from "../../core/browser";
import config from "../../config.json";
import type { AllEmbedDatasetArray } from "./kuronime.type";
import ora from "ora";

export class KuronimeService {
  constructor(
    private referenceUrl: string = config.platforms.find(
      (p) => p.name === "Kuronime",
    )?.slug_url || "",
  ) {
    if (!this.referenceUrl)
      throw new Error("Kuronime URL not found in config.");
  }

  async scrapeSpecificEpisode(slug: string) {
    const targetUrl = this.referenceUrl.replace("{slug}", slug);

    const page = await browser.newPage();
    await page.goto(targetUrl);

    const spinnerPage = ora("Loading episode page...").start();
    await page
      .waitForFunction(() => {
        const select = document.querySelector("#mirrorList");
        return select && select.querySelectorAll("option").length > 1;
      })
      .then(() => spinnerPage.succeed("Episode page loaded."))
      .catch(() => spinnerPage.fail("Failed to load episode page."));

    const spinnermain = ora("Extracting embed URLs...").start();
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
    options.length > 0
      ? spinnermain.succeed("Embed URLs extracted.")
      : spinnermain.fail("No embed URLs found.");

    const result: AllEmbedDatasetArray = [];
    let count = 0;
    for (const option of options) {
      count++;
      const spinner = ora(
        `Processing mirror... (${count}/${options.length})`,
      ).start();
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
      spinner.succeed(`Mirror processed: ${option.value}`);
    }
    return result;
  }

  async scrapeAllEpisodeData(slug: string) {
    const page = await browser.newPage();
    const targetUrl = this.referenceUrl.replace("{slug}", slug);
    await page.goto(targetUrl);

    const episodeLinks = await page.$$eval(
      "div.bxcl ul li span.lchx a",
      (links: HTMLAnchorElement[]) =>
        links.map((link) => ({
          name: link.textContent.trim(),
          url: link.href,
        })),
    );

    console.log(episodeLinks);
  }
}

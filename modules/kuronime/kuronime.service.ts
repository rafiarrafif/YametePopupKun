import { browser } from "../../core/browser";
import config from "../../config.json";
import type { AllEmbedDatasetArray } from "./kuronime.type";
import ora from "ora";

export class KuronimeService {
  constructor(
    private referenceUrl: string = config.platforms.find(
      (p) => p.name === "Kuronime",
    )?.slug_url || "",
    private baseUrl: string = config.platforms.find(
      (p) => p.name === "Kuronime",
    )?.url || "",
  ) {
    if (!this.referenceUrl || !this.baseUrl)
      throw new Error("Kuronime URL not found in config.");
  }

  async scrapeSpecificEpisode(slug: string, progress: boolean = true) {
    const targetUrl = this.referenceUrl.replace("{slug}", slug);

    // Step 1: Load the episode page
    const spinnerPage = progress
      ? ora("Loading episode page...").start()
      : null;
    const page = await browser.newPage();
    await page.goto(targetUrl);
    await page.mouse.move(100, 100);
    if (page.url().includes("404")) {
      spinnerPage?.fail("Episode page not found (404).");
      process.exit(1);
    }

    // Step 2: Wait for the embed options to load
    try {
      await page.waitForSelector("#mirrorList option:not([disabled])", {
        state: "attached",
        timeout: 60000,
      });
      spinnerPage?.succeed("Episode page loaded.");
    } catch (err) {
      spinnerPage?.fail("Failed to load episode page.");
      throw err;
    }

    // Step 3: Extract all embed URLs
    const spinnermain = progress
      ? ora("Extracting embed URLs...").start()
      : null;
    const options = await page.$$eval(
      "#mirrorList option:not([disabled])",
      (opts: HTMLOptionElement[]) =>
        opts
          .filter((o: HTMLOptionElement) => !o.disabled && o.value)
          .map((o: HTMLOptionElement) => ({
            value: o.value,
            text: o.textContent?.trim() || "",
          })),
    );
    options.length > 0
      ? spinnermain?.succeed("Embed URLs extracted.")
      : spinnermain?.fail("No embed URLs found.");

    // Step 4: Iterate through each embed option and extract the iframe URL
    const result: AllEmbedDatasetArray = [];
    let count = 0;
    for (const option of options) {
      count++;
      const spinner = ora(
        `Processing mirror... (${count}/${options.length})`,
      ).start();

      // Select the embed option and wait for the iframe to load
      await page.selectOption("#mirrorList", option.value, {
        force: true,
      });
      await page.waitForFunction(() => {
        const iframe: HTMLIFrameElement | null =
          document.querySelector("iframe#iframedc");
        return iframe && iframe.src && iframe.src.startsWith("https");
      });

      // Extract the iframe src URL
      const src = await page.getAttribute("iframe#iframedc", "src");
      if (src) {
        result.push({ name: option.text, value: option.value, url: src });
      }
      spinner.succeed(`Mirror processed: ${option.value}`);
    }
    return result;
  }

  async scrapeAllEpisodeData(slug: string) {
    const spinnerGetLinks = ora("Extracting episode links...").start();
    const page = await browser.newPage();
    const targetUrl = this.referenceUrl.replace("{slug}", slug);
    await page.goto(targetUrl);

    const episodeLinks = await page.$$eval(
      "div.bxcl ul li span.lchx a",
      (links: HTMLAnchorElement[], baseUrl: string) =>
        links
          .map((link) => ({
            name: link.textContent.trim(),
            url: link.href.replace(baseUrl, "").replace(/^\/|\/$/g, ""),
          }))
          .reverse(),
      this.baseUrl,
    );

    if (episodeLinks.length > 0) {
      spinnerGetLinks.succeed("Episode links extracted.");
      const getEachEpisodeSpinner = ora(
        "Extracting embed URLs for each episode...",
      ).start();

      let episodeCount = 0;
      const allData: AllEmbedDatasetArray = [];
      for (const episode of episodeLinks) {
        episodeCount++;
        try {
          const embeds = await this.scrapeSpecificEpisode(episode.url, false);
          getEachEpisodeSpinner.succeed(
            `${episode.name} processed (${episodeCount}/${episodeLinks.length}).`,
          );
          allData.push(...embeds);
        } catch (err) {
          getEachEpisodeSpinner.fail(
            `Failed to extract data for episode: ${episode.name}`,
          );
          console.error(err);
        }
      }
      getEachEpisodeSpinner.succeed("All episodes processed.");
      console.table(allData);
    } else {
      spinnerGetLinks.fail("No episode links found.");
      process.exit(1);
    }
  }
}

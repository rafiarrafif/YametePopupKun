import inquirer from "inquirer";
import { KuronimeService } from "./kuronime.service";
import { closeBrowser } from "../../core/browser";
import { KuronimeRepository } from "./kuronime.repository";

export class KuronimeController {
  async mainHandler() {
    try {
      const { action } = await inquirer.prompt([
        {
          type: "select",
          name: "action",
          message: "Select scrapping mode:",
          choices: [
            { name: "Per Episode", value: "perEpisode" },
            { name: "All Episode (Batch)", value: "allEpisode" },
          ],
        },
      ]);

      switch (action) {
        case "perEpisode":
          await this.perEpisodeHandler();
          break;
        case "allEpisode":
          await this.allEpisodeHandler();
          break;
        default:
          console.log("Invalid action selected.");
      }
    } catch (error) {
      console.error("An error occurred during the scraping process.", error);
    }
  }

  async perEpisodeHandler() {
    const slug = await this.getSlugUrl("nonton-one-piece-episode-1");
    const data = await new KuronimeService().scrapeSpecificEpisode(slug);
    await new KuronimeRepository().saveToJson(data, slug);
    await closeBrowser();
  }

  async allEpisodeHandler() {
    const slug = await this.getSlugUrl("anime/one-piece");
    const data = await new KuronimeService().scrapeAllEpisodeData(slug);
    // await new KuronimeRepository().saveToJson(data, slug);
    await closeBrowser();
  }

  async getSlugUrl(example: string) {
    const input = await inquirer.prompt([
      {
        type: "input",
        name: "slug",
        message: `Enter the slug of the anime you want to scrape (e.g. \`${example}\`):`,
        validate: function (input) {
          if (input.trim() === "") {
            return "Slug cannot be empty. Please enter a valid slug.";
          } else if (!/^[a-z0-9-\/]+$/.test(input.trim())) {
            return "Slug can only contain lowercase letters, numbers, hyphens, and slashes. Please enter a valid slug.";
          }
          return true;
        },
      },
    ]);
    return input.slug.trim();
  }
}

import inquirer from "inquirer";
import { KuronimeService } from "./kuronime.service";

export class KuronimeController {
  async mainHandler() {
    const slug = await this.getSlugUrl();
    console.log(`You entered the slug: ${slug}`);
  }

  async getSlugUrl() {
    const inputField = await inquirer.prompt([
      {
        type: "input",
        name: "slug",
        message:
          "Enter the slug of the anime you want to scrape (e.g. 'one-piece-1000'):",
        validate: function (input) {
          if (input.trim() === "") {
            return "Slug cannot be empty. Please enter a valid slug.";
          } else if (!/^[a-z0-9-]+$/.test(input.trim())) {
            return "Slug can only contain lowercase letters, numbers, and hyphens. Please enter a valid slug.";
          }
          return true;
        },
      },
    ]);

    await new KuronimeService().scrapeAnimeData(inputField.slug.trim());
  }
}

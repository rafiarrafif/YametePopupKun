import boxen from "boxen";
import { showMenu } from "./cli/menu";
import figlet from "figlet";
import chalk from "chalk";

async function main() {
  const welcomeText = `
  ${figlet.textSync("Anime Scraper", {
    horizontalLayout: "full",
    font: "Rectangles",
  })}
  ${chalk.gray("Created by Rafi Arrafif 🚀")}
  `;

  console.log(
    boxen(welcomeText, {
      borderStyle: "double",
    }),
  );

  await showMenu();
}

main();

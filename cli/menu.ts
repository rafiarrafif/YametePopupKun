import inquirer from "inquirer";
import config from "../config.json";
import { router } from "./router";

export const showMenu = async () => {
  try {
    const answer = await inquirer.prompt([
      {
        type: "select",
        name: "target",
        message: "Select streaming platform",
        choices: config.platforms.map((p) => p.name),
      },
    ]);

    return router(answer.target);
  } catch (error) {
    console.error("Please select a valid option.");
  }
};

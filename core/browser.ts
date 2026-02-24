import { chromium } from "playwright";
import config from "../config.json";

const window = await chromium.launch({
  headless: config.browser_window.headless,
});

export const browser = await window.newContext({
  viewport: {
    width: config.browser_window.width,
    height: config.browser_window.height,
  },
});

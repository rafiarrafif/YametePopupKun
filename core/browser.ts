import { chromium } from "playwright";
import config from "../config.json";

const window = await chromium.launch({
  headless: config.browser_window.headless,
});

export const browser = await window.newContext({
  userAgent: config.browser_window.user_agent,
  viewport: {
    width: config.browser_window.width,
    height: config.browser_window.height,
  },
});

export const closeBrowser = async () => {
  await browser.close();
  await window.close();
};

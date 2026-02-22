import { chromium } from "playwright";

(async () => {
  const targetUrl = prompt("Enter the URL to scrape:");
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();
  await page.goto(`https://kuronime.moe/${targetUrl}/`);
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

  const result: { name: string; value: string; url: string }[] = [];
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

  console.log(result);
  await browser.close();
})();

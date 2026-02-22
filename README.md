<div align="center">
  <h1>📦 Yamete Popup-kun</h1>
</div>

**Yamete Popup-kun** was born out of pure frustration. After one too many aggressive popups on Kuronime, the I reached enlightenment and said:

> “Yamete, Popup-kun!”

Instead of clicking the close button for the 87th time like a side character with no character development, this project was created to **automatically defeat popups and extract streaming mirror links like the true protagonist it is.**

Built with Playwright, YametePopupKun:

- Silences all popups
- Closes intrusive overlays
- Waits patiently (unlike us)
- Extracts streaming mirror iframe URLs
- Outputs clean structured results

## 💢 Why This Exists

YametePopupKun was created to:

- Automatically close donation popups
- Eliminate unnecessary click rituals
- Extract mirror stream links efficiently
- Restore peace and balance to your scraping workflow

## 🚀 Features

- Headless Chromium automation via Playwright
- Waits for dynamic mirror list loading
- Iterates through all available mirror options
- Extracts iframe src URLs
- Outputs structured JSON results
- Fully asynchronous and efficient

## 🛠 Installation

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/YametePopupKun.git
cd YametePopupKun
```

### 2️⃣ Install dependencies

```
bun install
```

### 3️⃣ Install Playwright browsers

```
bunx playwright install
```

## ▶ Usage

Run the script:

```
bun index.ts
```

You will be prompted:

```
Enter the URL to scrape:
```

Example input:

```
naruto-episode-1
```

The script will navigate to:

```
https://kuronime.moe/naruto-episode-1/
```

then:

1. Close Popup-kun
2. Waits for mirror list awakening
3. Extracts iframe URLs
4. Prints results to console

## ⚙ Configuration

### Headless Mode

Default:

```
headless: true
```

For debugging (watch Popup-kun lose in real time):

```
headless: false
```

### Viewport Size

Currently set to:

```
viewport: { width: 1920, height: 1080 }
```

Modify if needed.

## 📦 Dependencies

- Playwright
- Bun 1.3+
- Chromium (installed via Playwright)

Install manually:

```
bun install playwright
bunx playwright install
```

## 📤 Example Output

```
[
  {
    "name": "Mirror 1 - StreamSB",
    "value": "12345",
    "url": "https://streamsb.com/embed/xyz"
  },
  {
    "name": "Mirror 2 - DoodStream",
    "value": "67890",
    "url": "https://doodstream.com/e/abc"
  }
]
```

## 🐛 Troubleshooting

### Popup Not Closing

If the site changes structure, update selectors:

```
div#popup_box_donasi div.close-button
div#close-button
```

### Mirror List Not Loading

Possible reasons:

- Invalid slug
- Website structure changed
- Network issue
- Popup-kun evolved

### iframe `src` Not Updating

Verify selector:

```
iframe#iframedc
```

The site may:

- Delay loading
- Change iframe ID
- Add new anti-bot measures

## 📄 License

MIT License

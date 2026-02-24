export class Save {
  constructor(
    public folder: string,
    private data: unknown,
  ) {}
  async toJSON() {
    const fs = await import("fs");
    const path = `./output/${this.folder}/data.json`;
    fs.mkdirSync(`./output/${this.folder}`, { recursive: true });
    fs.writeFileSync(path, JSON.stringify(this.data, null, 4), "utf-8");
    return `Data saved to ${path}`;
  }
}

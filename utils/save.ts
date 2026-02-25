export class Save {
  constructor(
    public folder: string,
    public slug: string,
    private data: unknown,
  ) {}
  async toJSON() {
    const fs = await import("fs");
    const path = `./output/${this.folder}/episodes/${this.slug}/${new Date().toISOString().slice(0, 19).replace(/\D/g, "")}.json`;
    fs.mkdirSync(`./output/${this.folder}/episodes/${this.slug}`, {
      recursive: true,
    });
    fs.writeFileSync(path, JSON.stringify(this.data, null, 4), "utf-8");
    return `Data saved to ${path}`;
  }
}

export class Save {
  constructor(
    public path: string,
    private data: unknown,
  ) {}
  async toJSON() {
    const fs = await import("fs");
    fs.mkdirSync(this.path, {
      recursive: true,
    });
    const fileName = `${new Date().toISOString().slice(0, 19).replace(/\D/g, "")}.json`;
    fs.writeFileSync(
      `${this.path}/${fileName}`,
      JSON.stringify(this.data, null, 4),
      "utf-8",
    );
    return `Data saved to ${this.path}/${fileName}`;
  }
}

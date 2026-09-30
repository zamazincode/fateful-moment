// In-memory stand-in for expo-file-system's File API: paths map to their text content.
const files = new Map<string, string>();

export const Paths = { document: "file:///document" };

export class File {
  readonly uri: string;

  constructor(directory: string, name: string) {
    this.uri = `${directory}/${name}`;
  }

  get exists() {
    return files.has(this.uri);
  }

  create() {
    if (files.has(this.uri)) throw new Error(`${this.uri} already exists`);
    files.set(this.uri, "");
  }

  write(content: string) {
    if (!files.has(this.uri)) throw new Error(`${this.uri} does not exist`);
    files.set(this.uri, content);
  }

  textSync() {
    const content = files.get(this.uri);
    if (content === undefined) throw new Error(`${this.uri} does not exist`);
    return content;
  }
}

// Tests only.
export function __reset() {
  files.clear();
}

import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

export type Item = {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
};

export type State = {
  items: Item[];
};

export function createEmptyState(): State {
  return { items: [] };
}

function normalizeState(maybe: unknown): State {
  const empty = createEmptyState();
  if (!maybe || typeof maybe !== "object") return empty;

  const items = (maybe as any).items;
  if (!Array.isArray(items)) return empty;

  const normalized: Item[] = [];
  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    const id = String((it as any).id ?? "");
    const text = String((it as any).text ?? "");
    const done = Boolean((it as any).done ?? false);
    const createdAt = String((it as any).createdAt ?? "");
    if (!id || !text || !createdAt) continue;
    normalized.push({ id, text, done, createdAt });
  }

  normalized.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return { items: normalized };
}

export class Store {
  private state: State = createEmptyState();
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(private filePath: string) {}

  async init(): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      this.state = normalizeState(JSON.parse(raw));
    } catch {
      this.state = createEmptyState();
      await this.persist();
    }
  }

  snapshot(): State {
    return { items: [...this.state.items] };
  }

  async add(text: string): Promise<Item> {
    const cleaned = text.trim();
    if (!cleaned) throw new Error("text is required");
    if (cleaned.length > 200) throw new Error("text too long (max 200)");

    const item: Item = {
      id: nanoid(10),
      text: cleaned,
      done: false,
      createdAt: new Date().toISOString(),
    };

    this.state.items.push(item);
    await this.persist();
    return item;
  }

  async toggle(id: string): Promise<Item | null> {
    const item = this.state.items.find((x) => x.id === id);
    if (!item) return null;
    item.done = !item.done;
    await this.persist();
    return item;
  }

  async remove(id: string): Promise<boolean> {
    const before = this.state.items.length;
    this.state.items = this.state.items.filter((x) => x.id !== id);
    const changed = this.state.items.length !== before;
    if (changed) await this.persist();
    return changed;
  }

  async clear(): Promise<void> {
    this.state = createEmptyState();
    await this.persist();
  }

  private async persist(): Promise<void> {
    const payload = JSON.stringify(this.state, null, 2);

    this.writeQueue = this.writeQueue.then(async () => {
      await fs.writeFile(this.filePath, payload, "utf8");
    });

    await this.writeQueue;
  }
}
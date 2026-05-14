import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function parsePokemonList(raw: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const name = line.trim();
    if (!name) continue;
    if (seen.has(name)) continue;
    seen.add(name);
    result.push(name);
  }
  return result;
}

function main() {
  const root = resolve(process.cwd());
  const sources = [
    { src: 'ポケモンリスト（ポケチャン内定のみ）.txt', dest: 'data/pokemon-pokechan.json' },
    { src: 'ポケモンリスト（全ポケモン）.txt', dest: 'data/pokemon-all.json' },
  ];
  mkdirSync(resolve(root, 'data'), { recursive: true });
  for (const { src, dest } of sources) {
    let raw: string;
    try {
      raw = readFileSync(resolve(root, src), 'utf8');
    } catch {
      throw new Error(`source not found: ${src}`);
    }
    const list = parsePokemonList(raw);
    writeFileSync(resolve(root, dest), JSON.stringify(list, null, 2) + '\n', 'utf8');
    console.log(`${dest}: ${list.length} entries`);
  }
}

const isMain = process.argv[1] &&
  (process.argv[1] === fileURLToPath(import.meta.url) || process.argv[1].endsWith('generate-pokemon-data.ts'));
if (isMain) main();

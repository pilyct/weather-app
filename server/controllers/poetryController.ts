import type { Request, Response } from "express";
import poetryDB from "../models/poetryData";
import { getFallbackPoem } from "../data/fallbackPoems";

interface Poem {
  title: string;
  author: string;
  lines: string[];
}

const MAX_KEYWORD_LEN = 40;
// Allow letters/numbers/space and a couple punctuation marks that make sense for words/names
const KEYWORD_ALLOWLIST = /^[a-zA-Z0-9\s'-]*$/;

function normalizeKeyword(input: unknown): string {
  if (typeof input !== "string") return "";
  const trimmed = input.trim().slice(0, MAX_KEYWORD_LEN);
  if (!KEYWORD_ALLOWLIST.test(trimmed)) return "";
  return trimmed;
}

// Count substring occurrences safely (avoids regex injection/ReDoS)
function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();

  let count = 0;
  let pos = 0;
  while (true) {
    const idx = h.indexOf(n, pos);
    if (idx === -1) break;
    count++;
    pos = idx + n.length;
  }
  return count;
}

async function getPoemData(req: Request, res: Response): Promise<void> {
  const searchTerm = normalizeKeyword(req.query.keyword);

  // If you want to allow empty keyword to still return a random poem, keep this as-is.
  // If you want to require a keyword, uncomment the block below.
  /*
  if (!searchTerm) {
    res.status(400).json({ error: "Invalid keyword" });
    return;
  }
  */

  try {
    const selectedPoem = await fetchBestMatchFromPoetryDB(searchTerm);

    if (selectedPoem) {
      const occurrences = countOccurrences(
        selectedPoem.lines.join(" "),
        searchTerm,
      );
      res.json({
        weatherWord: searchTerm,
        occurrences,
        title: selectedPoem.title,
        author: selectedPoem.author,
        lines: selectedPoem.lines,
      });
      return;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("PoetryDB unavailable, using fallback poem:", message);
  }

  // PoetryDB failed, errored, or had nothing usable — serve a curated
  // local poem instead of surfacing an error to the client.
  const fallbackPoem = getFallbackPoem(searchTerm);
  const occurrences = countOccurrences(
    fallbackPoem.lines.join(" "),
    searchTerm,
  );
  res.json({
    weatherWord: searchTerm,
    occurrences,
    title: fallbackPoem.title,
    author: fallbackPoem.author,
    lines: fallbackPoem.lines,
  });
}

async function fetchBestMatchFromPoetryDB(
  searchTerm: string,
): Promise<Poem | null> {
  // Build URL safely and encode the user-provided segment
  const base = new URL(poetryDB.BASE_URL);
  const basePath = base.pathname.replace(/\/$/, "");
  base.pathname = `${basePath}/lines,random/${encodeURIComponent(searchTerm)};5`;

  const poetryResponse = await fetch(base.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(5000),
  });

  if (!poetryResponse.ok) {
    throw new Error(`PoetryDB responded with status ${poetryResponse.status}`);
  }

  const poetryData = (await poetryResponse.json()) as unknown;

  if (!Array.isArray(poetryData) || poetryData.length === 0) {
    return null;
  }

  // Validate shape defensively
  const poems: Poem[] = poetryData
    .filter(
      (p: any) =>
        p &&
        typeof p.title === "string" &&
        typeof p.author === "string" &&
        Array.isArray(p.lines) &&
        p.lines.every((l: any) => typeof l === "string"),
    )
    .map((p: any) => ({ title: p.title, author: p.author, lines: p.lines }));

  let selectedPoem: Poem | null = null;
  let occurrencesCount = 0;

  for (const poem of poems) {
    const text = poem.lines.join(" ");
    const occurrences = countOccurrences(text, searchTerm);

    if (occurrences > occurrencesCount) {
      occurrencesCount = occurrences;
      selectedPoem = poem;
    }
  }

  return selectedPoem;
}

export { getPoemData };

import type { Request, Response } from "express";
import poetryDB from "../models/poetryData";

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
    // Build URL safely and encode the user-provided segment
    const base = new URL(poetryDB.BASE_URL);
    const basePath = base.pathname.replace(/\/$/, "");
    base.pathname = `${basePath}/lines,random/${encodeURIComponent(searchTerm)};5`;

    const poetryResponse = await fetch(base.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!poetryResponse.ok) {
      res.status(502).json({
        error: "Upstream service error",
        status: poetryResponse.status,
      });
      return;
    }

    const poetryData = (await poetryResponse.json()) as unknown;

    if (!Array.isArray(poetryData) || poetryData.length === 0) {
      res.status(404).json({ error: "Sorry, no poem found" });
      return;
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

    if (poems.length === 0) {
      res.status(404).json({ error: "Sorry, no poem found" });
      return;
    }

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

    if (!selectedPoem) {
      res.status(404).json({ error: "Sorry, no poem found" });
      return;
    }

    res.json({
      weatherWord: searchTerm,
      occurrences: occurrencesCount,
      title: selectedPoem.title,
      author: selectedPoem.author,
      lines: selectedPoem.lines,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error fetching poem data:", message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export { getPoemData };

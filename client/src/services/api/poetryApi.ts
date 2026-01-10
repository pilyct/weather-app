import type { PoemData } from "../../types";

export async function getPoetryData(keyword: string): Promise<PoemData | null> {
  try {
    const res = await fetch(`/poem?keyword=${encodeURIComponent(keyword)}`);
    if (!res.ok) return null;
    return (await res.json()) as PoemData;
  } catch {
    return null;
  }
}

import axios from "axios";

const SERPER_API_URL = "https://google.serper.dev/search";

const REAL_TIME_KEYWORDS = [
  "today", "now", "current", "latest", "recent", "news",
  "weather", "price", "stock", "score", "live", "2024", "2025", "2026",
  // sports
  "ipl", "cricket", "match", "schedule", "fixture", "tournament",
  "nba", "nfl", "football", "game", "season", "standings",
  // events
  "when is", "when does", "when will", "release", "launch", "start",
];

export function needsRealTimeData(query: string): boolean {
  const lower = query.toLowerCase();
  return REAL_TIME_KEYWORDS.some((kw) => lower.includes(kw));
}

export interface SerperResult {
  title: string;
  snippet: string;
  link: string;
}

export async function searchWeb(query: string): Promise<SerperResult[]> {
  try {
    // Append current year to force recent results
    const currentYear = new Date().getFullYear();
    const timedQuery = `${query} ${currentYear}`;

    const response = await axios.post(
      SERPER_API_URL,
      { 
        q: timedQuery, 
        num: 5,
        tbs: "qdr:m" // filters results to past month
      },
      {
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    const results: SerperResult[] = [];

    if (data.answerBox) {
      results.push({
        title: "Answer",
        snippet: data.answerBox.answer || data.answerBox.snippet || "",
        link: data.answerBox.link || "",
      });
    }

    if (data.organic) {
      data.organic.slice(0, 4).forEach((r: any) => {
        results.push({ title: r.title, snippet: r.snippet, link: r.link });
      });
    }

    return results;
  } catch (err) {
    console.error("Serper error:", err);
    return [];
  }
}

export function formatSerperResults(results: SerperResult[]): string {
  if (!results.length) return "";
  return (
    "### Real-Time Web Results:\n" +
    results
      .map((r, i) => `[${i + 1}] **${r.title}**\n${r.snippet}\nSource: ${r.link}`)
      .join("\n\n")
  );
}

// lib/scrapers/websiteScraper.ts
import * as cheerio from "cheerio";

export async function fetchHTML(url: string, timeout = 15000) {
  try {
    // ensure protocol
    if (!/^https?:\/\//i.test(url)) url = "http://" + url;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, { signal: controller.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible)" } });
    clearTimeout(id);
    if (!res.ok) return null;
    const text = await res.text();
    return text;
  } catch (e) {
    return null;
  }
}

export async function extractCompanyAboutFromWebsite(url?: string) {
  if (!url) return { about: "", aboutUrls: [] };

  try {
    const html = await fetchHTML(url);
    if (!html) return { about: "", aboutUrls: [] };

    const $ = cheerio.load(html);

    // Prefer meta description
    const metaDesc = $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || "";

    // Collect candidate links to about/team pages
    const rawLinks = $("a")
      .map((i, el) => $(el).attr("href") || "")
      .get()
      .filter(Boolean);

    const resolvedLinks = Array.from(new Set(rawLinks.map((l) => {
      try {
        return new URL(l, url).toString();
      } catch {
        return "";
      }
    }))).filter(Boolean);

    const aboutCandidates = resolvedLinks.filter((l) => /about|team|company|who-we-are|our-story|mission/i.test(l)).slice(0, 6);

    let aboutText = (metaDesc || "").trim();

    // Fetch candidates and pick the longest meaningful paragraph
    for (const aboutUrl of aboutCandidates) {
      const h = await fetchHTML(aboutUrl);
      if (!h) continue;
      const $2 = cheerio.load(h);
      const pText = $2("p")
        .map((i, el) => $2(el).text().trim())
        .get()
        .filter(Boolean)
        .sort((a, b) => b.length - a.length)[0];
      if (pText && pText.length > (aboutText || "").length) {
        aboutText = pText;
      }
    }

    // fallback: choose longest paragraph from homepage
    if (!aboutText) {
      const longText = $("p")
        .map((i, el) => $(el).text().trim())
        .get()
        .filter(Boolean)
        .sort((a, b) => b.length - a.length)
        .slice(0, 3)
        .join("\n\n");
      aboutText = longText;
    }

    return { about: aboutText || "", aboutUrls: aboutCandidates };
  } catch (e) {
    return { about: "", aboutUrls: [] };
  }
}

// lib/scrapers/newsFetcher.ts
export async function fetchCompanyNews(companyName: string, limit = 3) {
  const key = process.env.NEWSAPI_KEY;
  if (!key || !companyName) return [];
  try {
    const q = encodeURIComponent(companyName);
    const url = `https://newsapi.org/v2/everything?q=${q}&pageSize=${limit}&sortBy=publishedAt&apiKey=${key}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    const articles = (json.articles || []).map((a: any) => ({
      title: a.title,
      url: a.url,
      source: a.source?.name,
      publishedAt: a.publishedAt,
    }));
    return articles.slice(0, limit);
  } catch {
    return [];
  }
}

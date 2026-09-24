// Latest Instagram posts for the Bright Dressage home page.
// Reads Joe's Instagram (via the Joe Bright Dressage Facebook page) and returns the 6 newest posts.
// The access token lives in the Netlify environment variable IG_TOKEN, never in the site code.
const IG_USER_ID = "17841401853252750"; // @brightdressage

export default async () => {
  const token = process.env.IG_TOKEN;
  if (!token) return Response.json({ posts: [], error: "not configured" }, { status: 200 });

  const fields = "caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const url = `https://graph.facebook.com/v21.0/${IG_USER_ID}/media?fields=${fields}&limit=6&access_token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok || !Array.isArray(data.data)) {
      return Response.json({ posts: [], error: "instagram unavailable" }, { status: 200, headers: { "Cache-Control": "no-store" } });
    }
    const posts = data.data.map((p) => ({
      image: p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url,
      video: p.media_type === "VIDEO",
      caption: (p.caption || "").split("\n")[0].slice(0, 140),
      link: p.permalink,
      date: p.timestamp,
    })).filter((p) => p.image);

    return Response.json({ posts }, {
      headers: {
        "Cache-Control": "public, max-age=300",
        "Netlify-CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    return Response.json({ posts: [], error: "fetch failed" }, { status: 200, headers: { "Cache-Control": "no-store" } });
  }
};

export const config = { path: "/api/instagram" };

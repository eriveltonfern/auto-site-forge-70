import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://www.desentupidoraemgoiania24h.com.br";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Fetch all data in parallel
  const [servicesRes, neighborhoodsRes, citiesRes, blogRes] = await Promise.all([
    supabase.from("services").select("slug, updated_at").eq("status", "published").order("sort_order"),
    supabase.from("neighborhoods").select("slug, updated_at").eq("status", "published").order("name"),
    supabase.from("cities").select("slug, updated_at").eq("status", "published").order("name"),
    supabase.from("blog_posts").select("slug, updated_at").eq("status", "published").order("published_at", { ascending: false }),
  ]);

  const services = servicesRes.data || [];
  const neighborhoods = neighborhoodsRes.data || [];
  const cities = citiesRes.data || [];
  const blogPosts = blogRes.data || [];

  const today = new Date().toISOString().split("T")[0];

  const urls: { loc: string; lastmod: string; priority: string; changefreq: string }[] = [];

  // Static pages
  urls.push({ loc: `${SITE_URL}/`, lastmod: today, priority: "1.0", changefreq: "daily" });
  urls.push({ loc: `${SITE_URL}/servicos`, lastmod: today, priority: "0.8", changefreq: "weekly" });
  urls.push({ loc: `${SITE_URL}/areas-atendidas`, lastmod: today, priority: "0.8", changefreq: "weekly" });
  urls.push({ loc: `${SITE_URL}/sobre`, lastmod: today, priority: "0.5", changefreq: "monthly" });
  urls.push({ loc: `${SITE_URL}/contato`, lastmod: today, priority: "0.6", changefreq: "monthly" });
  urls.push({ loc: `${SITE_URL}/blog`, lastmod: today, priority: "0.7", changefreq: "daily" });

  // Service pages
  for (const s of services) {
    urls.push({
      loc: `${SITE_URL}/servicos/${s.slug}`,
      lastmod: s.updated_at?.split("T")[0] || today,
      priority: "0.8",
      changefreq: "weekly",
    });
  }

  // City pages
  for (const c of cities) {
    urls.push({
      loc: `${SITE_URL}/${c.slug}`,
      lastmod: c.updated_at?.split("T")[0] || today,
      priority: "0.8",
      changefreq: "weekly",
    });
  }

  // Neighborhood pages
  for (const n of neighborhoods) {
    urls.push({
      loc: `${SITE_URL}/${n.slug}`,
      lastmod: n.updated_at?.split("T")[0] || today,
      priority: "0.9",
      changefreq: "weekly",
    });
  }

  // Service + Neighborhood combo pages
  for (const s of services) {
    for (const n of neighborhoods) {
      urls.push({
        loc: `${SITE_URL}/${s.slug}-${n.slug}`,
        lastmod: today,
        priority: "0.7",
        changefreq: "weekly",
      });
    }
  }

  // Blog posts
  for (const p of blogPosts) {
    urls.push({
      loc: `${SITE_URL}/blog/${p.slug}`,
      lastmod: p.updated_at?.split("T")[0] || today,
      priority: "0.6",
      changefreq: "monthly",
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});

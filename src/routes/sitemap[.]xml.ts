import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://sabia-market-circular-agro.lovable.app";

const entries = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/mercado", priority: "0.9", changefreq: "weekly" },
  { path: "/ultima-colheita", priority: "0.8", changefreq: "weekly" },
  { path: "/agua", priority: "0.7", changefreq: "weekly" },
  { path: "/biomerenda", priority: "0.7", changefreq: "weekly" },
  { path: "/dashboard", priority: "0.7", changefreq: "weekly" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = entries
          .map(
            (e) =>
              `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

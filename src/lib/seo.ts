const SITE_URL = "https://sabia-market-circular-agro.lovable.app";

export function pageHead(opts: {
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}) {
  const url = `${SITE_URL}${opts.path}`;
  const ogTitle = opts.ogTitle ?? opts.title;
  const ogDescription = opts.ogDescription ?? opts.description;
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: ogDescription },
      { property: "og:url", content: url },
      { name: "twitter:title", content: ogTitle },
      { name: "twitter:description", content: ogDescription },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

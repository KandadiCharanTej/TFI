import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tfi-and-pitch.example";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dev/", "/offline"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

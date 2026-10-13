import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://devpostify.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/settings", "/drafts", "/bookmarks"], // Private user routes ko index hone se bachaega
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

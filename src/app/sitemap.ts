import type { MetadataRoute } from "next";
import kenshoData from "@/data/kensho.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kensho-hunter-dx.vercel.app";

  const kenshoPages = kenshoData.map((k) => ({
    url: `${baseUrl}/kensho/${k.id}`,
    lastModified: new Date(k.createdAt),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...kenshoPages,
  ];
}

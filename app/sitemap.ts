import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

/** Served at /sitemap.xml: tells search engines which pages exist. */
export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();
    return [
        { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
        { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
        { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
        { url: `${SITE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    ];
}

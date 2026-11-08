import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

/** Served at /robots.txt: allows crawling and points crawlers to the sitemap. */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: "*", allow: "/" },
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}

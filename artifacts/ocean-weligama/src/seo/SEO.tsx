import { useEffect } from "react";
import { defaultSEOConfig, getCanonicalUrl } from "./config";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

export function SEO({
  title,
  description = defaultSEOConfig.defaultDescription,
  keywords = defaultSEOConfig.defaultKeywords,
  canonicalPath = "",
  ogImage = defaultSEOConfig.defaultOgImage,
  ogType = "website",
  noIndex = false,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | Ocean Air Weligama Hotel & Villa`
    : defaultSEOConfig.defaultTitle;

  const canonicalUrl = getCanonicalUrl(canonicalPath);
  const pathPart = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
  const comUrl = `${defaultSEOConfig.primaryDomainCom}${pathPart}`;
  const lkUrl = `${defaultSEOConfig.primaryDomainLk}${pathPart}`;
  const sriLankaUrl = `${defaultSEOConfig.primaryDomainSriLanka}${pathPart}`;

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper function to set or create meta element
    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        if (isProperty) {
          el.setAttribute("property", name);
        } else {
          el.setAttribute("name", name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Helper function to set or create link element
    const setLink = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]`;
      let el = document.querySelector(selector) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        if (hreflang) el.setAttribute("hreflang", hreflang);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    // 2. Standard & High-Performance Search Meta Tags
    setMeta("description", description);
    setMeta("keywords", keywords.join(", "));
    setMeta("google-site-verification", "googlef2f7e36381b95335");
    setMeta(
      "robots",
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );
    setMeta("googlebot", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setMeta("bingbot", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setMeta("revisit-after", "1 days");
    setMeta("rating", "general");
    setMeta("author", "Ocean Air Weligama Hotel & Villa");

    // 3. Open Graph Tags
    setMeta("og:site_name", defaultSEOConfig.siteName, true);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:type", ogType, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:locale", "en_US", true);
    setMeta("og:locale:alternate", "en_LK", true);

    // 4. Twitter Card Tags
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:site", defaultSEOConfig.twitterHandle);
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    // 5. Geo Location Tags (Pinpoint Weligama Bay Coordinates)
    setMeta("geo.region", "LK-31");
    setMeta("geo.placename", "Weligama, Matara, Southern Province, Sri Lanka");
    setMeta("geo.position", `${defaultSEOConfig.location.latitude};${defaultSEOConfig.location.longitude}`);
    setMeta("ICBM", `${defaultSEOConfig.location.latitude}, ${defaultSEOConfig.location.longitude}`);

    // 6. Canonical Link (.com vs .lk vs oceanairsrilanka.com unified authority)
    setLink("canonical", canonicalUrl);

    // 7. Multi-Domain & International Hreflang Link Tags
    setLink("alternate", comUrl, "en");
    setLink("alternate", lkUrl, "en-LK");
    setLink("alternate", sriLankaUrl, "en-US");
    setLink("alternate", comUrl, "en-GB");
    setLink("alternate", comUrl, "x-default");

  }, [fullTitle, description, keywords, canonicalUrl, ogImage, ogType, noIndex, comUrl, lkUrl, sriLankaUrl]);

  return null;
}

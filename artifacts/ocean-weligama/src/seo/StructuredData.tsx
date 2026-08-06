import { useEffect } from "react";
import {
  generateHotelSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
} from "./jsonLd";

export interface StructuredDataProps {
  breadcrumbs?: { name: string; item: string }[];
  faqs?: { question: string; answer: string }[];
}

export function StructuredData({ breadcrumbs, faqs }: StructuredDataProps) {
  useEffect(() => {
    const schemas: object[] = [
      generateHotelSchema(),
      generateOrganizationSchema(),
    ];

    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push(generateBreadcrumbSchema(breadcrumbs));
    }

    if (faqs && faqs.length > 0) {
      schemas.push(generateFaqSchema(faqs));
    }

    const scriptId = "seo-json-ld-scripts";
    let existingContainer = document.getElementById(scriptId);
    if (existingContainer) {
      existingContainer.remove();
    }

    const container = document.createElement("div");
    container.id = scriptId;

    schemas.forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      container.appendChild(script);
    });

    document.head.appendChild(container);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [breadcrumbs, faqs]);

  return null;
}

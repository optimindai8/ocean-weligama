import { useEffect } from "react";
import {
  generateHotelSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
  generateRoomSchema,
  generateBlogPostSchema,
  generatePackageSchema,
  generateImageGallerySchema,
} from "./jsonLd";

export interface StructuredDataProps {
  breadcrumbs?: { name: string; item: string }[];
  faqs?: { question: string; answer: string }[];
  room?: Parameters<typeof generateRoomSchema>[0];
  blog?: Parameters<typeof generateBlogPostSchema>[0];
  service?: Parameters<typeof generatePackageSchema>[0];
  gallery?: Parameters<typeof generateImageGallerySchema>[0];
}

export function StructuredData({
  breadcrumbs,
  faqs,
  room,
  blog,
  service,
  gallery,
}: StructuredDataProps) {
  useEffect(() => {
    const schemas: object[] = [
      generateHotelSchema(),
      generateOrganizationSchema(),
      generateWebSiteSchema(),
    ];

    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push(generateBreadcrumbSchema(breadcrumbs));
    }

    if (faqs && faqs.length > 0) {
      schemas.push(generateFaqSchema(faqs));
    }

    if (room) {
      schemas.push(generateRoomSchema(room));
    }

    if (blog) {
      schemas.push(generateBlogPostSchema(blog));
    }

    if (service) {
      schemas.push(generatePackageSchema(service));
    }

    if (gallery) {
      schemas.push(generateImageGallerySchema(gallery));
    }

    const scriptId = "seo-json-ld-scripts";
    const existingContainer = document.getElementById(scriptId);
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
  }, [breadcrumbs, faqs, room, blog, service, gallery]);

  return null;
}

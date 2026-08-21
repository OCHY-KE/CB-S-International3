import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_CONFIG, ROUTE_SEO, generateOrganizationSchema } from '../utils/seoConfig';

/**
 * Universal SEO component that automatically manages page title, meta descriptions,
 * OpenGraph, Twitter cards, canonical tags, and structured JSON-LD schemas based on route
 * or custom props passed by the page.
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  ogType,
  canonicalUrl,
  noIndex,
  jsonLd
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine metadata from route lookup or fallback to site defaults
  const routeMeta = ROUTE_SEO[currentPath] || {};

  const pageTitle = title || routeMeta.title || SITE_CONFIG.defaultTitle;
  const fullTitle = pageTitle.includes(SITE_CONFIG.shortName)
    ? pageTitle
    : `${pageTitle} | ${SITE_CONFIG.shortName}`;

  const pageDescription = description || routeMeta.description || SITE_CONFIG.defaultDescription;
  const pageKeywords = keywords || routeMeta.keywords || SITE_CONFIG.defaultKeywords;
  const pageImage = image || routeMeta.image || SITE_CONFIG.defaultImage;
  const pageOgType = ogType || routeMeta.ogType || 'website';
  const isNoIndex = noIndex !== undefined ? noIndex : (routeMeta.noIndex || false);
  const resolvedCanonical = canonicalUrl || `${SITE_CONFIG.siteUrl}${currentPath}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper to safely set or create meta tag
    const setMetaTag = (attrName, attrVal, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content || '');
    };

    // Helper to set link tags (e.g. canonical)
    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Search Meta Tags
    setMetaTag('name', 'description', pageDescription);
    setMetaTag('name', 'keywords', pageKeywords);
    setMetaTag('name', 'robots', isNoIndex ? 'noindex, nofollow' : 'index, follow');
    setMetaTag('name', 'author', SITE_CONFIG.siteName);
    setMetaTag('name', 'viewport', 'width=device-width, initial-scale=1.0');

    // 3. Canonical URL
    setLinkTag('canonical', resolvedCanonical);

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:site_name', SITE_CONFIG.siteName);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:url', resolvedCanonical);
    setMetaTag('property', 'og:type', pageOgType);
    setMetaTag('property', 'og:locale', 'en_US');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', SITE_CONFIG.twitterHandle);
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', pageDescription);
    setMetaTag('name', 'twitter:image', pageImage);

    // 6. Inject / Update Schema.org JSON-LD Structured Data
    const orgSchemaId = 'seo-schema-org';
    let orgScript = document.getElementById(orgSchemaId);
    if (!orgScript) {
      orgScript = document.createElement('script');
      orgScript.id = orgSchemaId;
      orgScript.type = 'application/ld+json';
      document.head.appendChild(orgScript);
    }
    orgScript.textContent = JSON.stringify(jsonLd || generateOrganizationSchema());

    // Website SearchAction Schema
    const webSchemaId = 'seo-schema-website';
    let webScript = document.getElementById(webSchemaId);
    if (!webScript) {
      webScript = document.createElement('script');
      webScript.id = webSchemaId;
      webScript.type = 'application/ld+json';
      document.head.appendChild(webScript);
    }
    webScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.siteName,
      alternateName: SITE_CONFIG.shortName,
      url: SITE_CONFIG.siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.siteUrl}/gallery?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });

  }, [fullTitle, pageDescription, pageKeywords, pageImage, pageOgType, isNoIndex, resolvedCanonical, jsonLd]);

  // Pure side-effect component, renders null in the DOM
  return null;
};

export default SEO;
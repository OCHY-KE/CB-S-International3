import React, { useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight, Compass, ShieldCheck, User, Film, Info, Headphones } from 'lucide-react';
import { generateBreadcrumbSchema } from '../utils/seoConfig';
import styles from '../styles/Breadcrumb.module.css';

// Route names & parent hierarchies mapping
const ROUTE_CONFIG = {
  '/': { label: 'Home', icon: Home },
  '/about': { label: 'About Us', parent: null, category: 'Company', icon: Info },
  '/gallery': { label: 'Visual Safari Gallery', parent: null, category: '4K Visuals', icon: Film },
  '/contact': { label: 'Contact & Expedition Concierge', parent: null, category: 'Inquiries', icon: Headphones },
  '/login': { label: 'Client Sign In', parent: { label: 'Client Portal', path: '/login' }, category: 'Account', icon: User },
  '/create-account': { label: 'Join Explorer Club', parent: { label: 'Client Portal', path: '/login' }, category: 'Account', icon: User },
  '/profile': { label: 'Explorer Profile', parent: { label: 'Client Portal', path: '/profile' }, category: 'Account', icon: User },
  '/admin-login': { label: 'Admin Sign In', parent: { label: 'Management', path: '/admin-login' }, category: 'Admin', icon: ShieldCheck },
  '/admin/dashboard': { label: 'Operations Dashboard', parent: { label: 'Admin Console', path: '/admin/dashboard' }, category: 'Management', icon: ShieldCheck },
  '/admin/gallery': { label: 'Gallery & Media Studio', parent: { label: 'Admin Console', path: '/admin/dashboard' }, category: 'Management', icon: Film },
  '/admin/itineraries': { label: 'Itinerary Manager', parent: { label: 'Admin Console', path: '/admin/dashboard' }, category: 'Management', icon: Compass }
};

const Breadcrumb = ({ customItems, hideOnHome = true }) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Compute breadcrumb items
  const breadcrumbItems = useMemo(() => {
    if (customItems && Array.isArray(customItems)) {
      return [{ label: 'Home', path: '/' }, ...customItems];
    }

    // Root homepage
    if (pathname === '/') {
      return [{ label: 'Home', path: '/' }];
    }

    const items = [{ label: 'Home', path: '/' }];
    const config = ROUTE_CONFIG[pathname];

    if (config) {
      if (config.parent) {
        items.push({ label: config.parent.label, path: config.parent.path });
      }
      items.push({ label: config.label, path: pathname });

    } else {
      // Fallback: build from path segments
      const segments = pathname.split('/').filter(Boolean);
      let cumulativePath = '';

      segments.forEach((segment) => {
        cumulativePath += `/${segment}`;
        const formattedLabel = segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());

        items.push({
          label: formattedLabel,
          path: cumulativePath
        });
      });
    }

    return items;
  }, [pathname, customItems]);

  // Inject Schema.org BreadcrumbList structured data for SEO rich snippets
  useEffect(() => {
    const scriptId = 'seo-breadcrumb-schema';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(generateBreadcrumbSchema(breadcrumbItems));
  }, [breadcrumbItems]);

  // Do not render on home page if hideOnHome is active
  if (pathname === '/' && hideOnHome) {
    return null;
  }

  const currentRouteMeta = ROUTE_CONFIG[pathname];

  return (
    <div className={styles.breadcrumbWrapper}>
      <div className={styles.container}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
          <ol className={styles.breadcrumbList} itemScope itemType="https://schema.org/BreadcrumbList">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              const isFirst = index === 0;

              return (
                <li
                  key={index}
                  className={styles.breadcrumbItem}
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  {index > 0 && (
                    <span className={styles.separator} aria-hidden="true">
                      <ChevronRight size={14} />
                    </span>
                  )}

                  {isLast ? (
                    <span
                      className={styles.activeItem}
                      aria-current="page"
                      itemProp="name"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      to={item.path}
                      className={styles.breadcrumbLink}
                      itemProp="item"
                    >
                      {isFirst && <Home size={15} className={styles.homeIcon} aria-hidden="true" />}
                      <span itemProp="name">{item.label}</span>
                    </Link>
                  )}
                  <meta itemProp="position" content={String(index + 1)} />
                </li>
              );
            })}
          </ol>
        </nav>

        {currentRouteMeta?.category && (
          <div className={styles.pageCategoryBadge}>
            <Compass size={13} />
            <span>{currentRouteMeta.category}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Breadcrumb;
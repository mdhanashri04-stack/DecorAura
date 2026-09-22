/**
 * DecorAura Analytics Utility for Google Analytics 4 (GA4)
 * Measurement ID: G-R5MQSETXPJ
 *
 * Ensures safe execution with window.gtag presence checks.
 * Prevents website crashes when GA is unavailable, blocked by ad-blockers, or offline.
 * Excludes tracking for administrative paths (/admin).
 */

export const GA_MEASUREMENT_ID = 'G-R5MQSETXPJ';

/**
 * Check if Google Analytics (gtag.js) is loaded and available
 */
export const isGAAvailable = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Check if current route is in the administrative area
 */
export const isAdminPath = (path) => {
  const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '');
  return currentPath.toLowerCase().startsWith('/admin');
};

/**
 * Send custom event to GA4 safely
 */
export const trackEvent = (eventName, parameters = {}) => {
  try {
    if (isAdminPath()) {
      return;
    }
    if (isGAAvailable()) {
      window.gtag('event', eventName, parameters);
    }
  } catch (err) {
    console.warn(`[DecorAura Analytics] Event tracking error (${eventName}):`, err);
  }
};

/**
 * Send SPA page view event to GA4 safely
 */
export const trackPageView = (path, title) => {
  try {
    if (isAdminPath(path)) {
      return;
    }
    if (isGAAvailable()) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
        send_to: GA_MEASUREMENT_ID
      });
    }
  } catch (err) {
    console.warn('[DecorAura Analytics] Page view tracking error:', err);
  }
};

/**
 * Track user navigation interactions
 * Events: nav_shop, nav_collections, nav_spaces, nav_journal
 */
export const trackNavigation = (destination) => {
  if (!destination) return;
  const cleanDest = destination.toLowerCase().replace(/^(nav_|#|\/)/, '');
  const validNavs = ['shop', 'collections', 'spaces', 'journal'];
  if (validNavs.includes(cleanDest)) {
    trackEvent(`nav_${cleanDest}`, {
      navigation_target: cleanDest
    });
  }
};

/**
 * Track Product View event (view_item)
 * Parameters: item_id, item_name, item_category, price, currency
 */
export const trackViewItem = (product) => {
  if (!product) return;
  const priceNum = Number(product.price) || 0;
  const currencyStr = product.currency || 'USD';
  const categoryStr = typeof product.category === 'object' ? product.category?.name : (product.category || 'Decor');

  trackEvent('view_item', {
    currency: currencyStr,
    value: priceNum,
    items: [
      {
        item_id: String(product.id || product.slug || ''),
        item_name: product.name || '',
        item_category: categoryStr,
        price: priceNum,
        currency: currencyStr
      }
    ],
    // Flat convenience parameters
    item_id: String(product.id || product.slug || ''),
    item_name: product.name || '',
    item_category: categoryStr,
    price: priceNum
  });
};

/**
 * Track Add To Cart event (add_to_cart)
 * Parameters: item_id, item_name, price, quantity, currency
 */
export const trackAddToCart = (product, quantity = 1) => {
  if (!product) return;
  const priceNum = Number(product.price) || 0;
  const qtyNum = Number(quantity) || 1;
  const currencyStr = product.currency || 'USD';
  const categoryStr = typeof product.category === 'object' ? product.category?.name : (product.category || 'Decor');

  trackEvent('add_to_cart', {
    currency: currencyStr,
    value: priceNum * qtyNum,
    items: [
      {
        item_id: String(product.id || product.slug || ''),
        item_name: product.name || '',
        item_category: categoryStr,
        price: priceNum,
        quantity: qtyNum,
        currency: currencyStr
      }
    ],
    // Flat convenience parameters matching spec
    item_id: String(product.id || product.slug || ''),
    item_name: product.name || '',
    price: priceNum,
    quantity: qtyNum,
    currency: currencyStr
  });
};

/**
 * Track Journal Article View event (view_article)
 * Parameters: article_slug, article_title, article_category
 */
export const trackViewArticle = (article) => {
  if (!article) return;
  const categoryStr = typeof article.category === 'object' ? article.category?.name : (article.category || 'Journal');

  trackEvent('view_article', {
    article_slug: String(article.slug || article.id || ''),
    article_title: article.title || '',
    article_category: categoryStr
  });
};

/**
 * Track Collection View event (view_collection)
 * Parameters: collection_slug, collection_name
 */
export const trackViewCollection = (collection) => {
  if (!collection) return;
  const slugStr = typeof collection === 'string' ? collection : (collection.slug || collection.id || '');
  const nameStr = typeof collection === 'string' ? collection : (collection.name || collection.title || slugStr);

  trackEvent('view_collection', {
    collection_slug: String(slugStr),
    collection_name: String(nameStr)
  });
};

/**
 * Track 3D Hero Assembly and Interaction Events
 * Events: hero_3d_loaded, hero_3d_completed, hero_3d_interaction
 */
export const track3DHeroEvent = (eventName, params = {}) => {
  const allowedEvents = ['hero_3d_loaded', 'hero_3d_completed', 'hero_3d_interaction'];
  if (allowedEvents.includes(eventName)) {
    trackEvent(eventName, params);
  }
};

/**
 * Track Shop The Look Hotspot Interaction
 * Parameters: product_id, product_name
 */
export const trackShopTheLookHotspot = (product) => {
  if (!product) return;
  trackEvent('shop_the_look_hotspot', {
    product_id: String(product.id || product.slug || ''),
    product_name: product.name || ''
  });
};

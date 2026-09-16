import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import Product from './pages/Product';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Admin from './pages/Admin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CartProvider, useCart } from './context/CartContext';
import { API } from './services/api';

function MainApp() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedCollectionSlug, setSelectedCollectionSlug] = useState('minimal');
  const { toastMessage } = useCart();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    const hash = window.location.hash.replace('#', '');
    if ((path === '/' || path === '' || path === '/home') && !hash) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, []);

  const handleHeroReady = () => {
    const hash = window.location.hash.replace('#', '');
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    if ((path === '/' || path === '' || path === '/home') && !hash) {
      ScrollTrigger.refresh();
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
      });
    } else if (hash) {
      scrollToElement(hash);
    }
  };

  const scrollToElement = (elementId) => {
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 120);
  };

  const parseUrlRoute = async () => {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    const hash = window.location.hash.replace('#', '');

    if (path === '/' || path === '' || path === '/home') {
      setCurrentRoute('home');
      if (hash) {
        setActiveSection(hash);
        scrollToElement(hash);
      } else {
        setActiveSection('hero');
        window.scrollTo(0, 0);
      }
    } else if (path === '/shop-page' || path === '/shop') {
      if (hash) {
        setCurrentRoute('home');
        setActiveSection(hash);
        scrollToElement(hash);
      } else if (path === '/shop-page') {
        setCurrentRoute('shop');
        window.scrollTo(0, 0);
      } else {
        setCurrentRoute('home');
        setActiveSection('shop');
        scrollToElement('shop');
      }
    } else if (path === '/collections-page' || path === '/collections') {
      if (path === '/collections-page') {
        setCurrentRoute('collections');
        window.scrollTo(0, 0);
      } else {
        setCurrentRoute('home');
        setActiveSection('collections');
        scrollToElement('collections');
      }
    } else if (path.startsWith('/collections/')) {
      const slug = path.split('/')[2];
      if (slug) {
        setSelectedCollectionSlug(slug);
        setCurrentRoute('collection-detail');
      } else {
        setCurrentRoute('collections');
      }
      window.scrollTo(0, 0);
    } else if (path.startsWith('/products/') || path.startsWith('/product/')) {
      const slug = path.split('/')[2];
      if (slug) {
        try {
          const prod = await API.getProduct(slug);
          setSelectedProduct(prod);
        } catch {
          const all = API.getFallbackProducts();
          setSelectedProduct(all[0]);
        }
        setCurrentRoute('product');
      } else {
        setCurrentRoute('home');
      }
      window.scrollTo(0, 0);
    } else if (path === '/journal-page' || path === '/journal' || path === '/blog') {
      if (path === '/journal-page') {
        setCurrentRoute('journal');
        window.scrollTo(0, 0);
      } else {
        setCurrentRoute('home');
        setActiveSection('journal');
        scrollToElement('journal');
      }
    } else if (path.startsWith('/journal/') || path.startsWith('/blog/') || path.startsWith('/blogs/')) {
      const slug = path.split('/')[2];
      if (slug) {
        try {
          const art = await API.getBlog(slug);
          setSelectedArticle(art);
        } catch {
          const all = API.getFallbackBlogs();
          setSelectedArticle(all[0]);
        }
        setCurrentRoute('article');
      } else {
        setCurrentRoute('journal');
      }
      window.scrollTo(0, 0);
    } else if (path === '/admin') {
      setCurrentRoute('admin');
      window.scrollTo(0, 0);
    } else if (path === '/spaces' || path === '/inspiration') {
      setCurrentRoute('home');
      setActiveSection('spaces');
      window.history.replaceState({}, '', '/#spaces');
      scrollToElement('spaces');
    } else {
      setCurrentRoute('home');
      setActiveSection('hero');
    }
  };

  useEffect(() => {
    parseUrlRoute();
    const handlePopState = () => {
      parseUrlRoute();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route, params = {}) => {
    const sectionRoutes = ['shop', 'collections', 'spaces', 'journal'];

    if (route === 'home' || route === 'hero') {
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
      setCurrentRoute('home');
      setActiveSection('hero');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionRoutes.includes(route) && !params.forcePage) {
      if (currentRoute !== 'home') {
        window.history.pushState({}, '', `/#${route}`);
        setCurrentRoute('home');
      } else {
        window.history.pushState({}, '', `/#${route}`);
      }
      setActiveSection(route);
      scrollToElement(route);
      return;
    }

    let url = '/';
    if (route === 'shop-page' || (route === 'shop' && params.forcePage)) url = '/shop';
    else if (route === 'collections-page' || (route === 'collections' && params.forcePage)) url = '/collections';
    else if (route === 'collection-detail') url = `/collections/${params.slug || selectedCollectionSlug || 'minimal'}`;
    else if (route === 'journal-page' || (route === 'journal' && params.forcePage)) url = '/journal';
    else if (route === 'admin') url = '/admin';

    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url);
    }
    if (params.slug) {
      setSelectedCollectionSlug(params.slug);
    }
    if (route === 'shop-page') setCurrentRoute('shop');
    else if (route === 'collections-page') setCurrentRoute('collections');
    else if (route === 'journal-page') setCurrentRoute('journal');
    else setCurrentRoute(route);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCollection = (coll) => {
    const slug = typeof coll === 'string' ? coll : coll.slug;
    setSelectedCollectionSlug(slug);
    const url = `/collections/${slug}`;
    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url);
    }
    setCurrentRoute('collection-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    const url = `/products/${prod.slug || prod.id}`;
    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url);
    }
    setCurrentRoute('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (art) => {
    setSelectedArticle(art);
    const url = `/blog/${art.slug || art.id}`;
    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url);
    }
    setCurrentRoute('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-ivory-50 text-charcoal-900 font-sans">
      <Navbar onNavigate={navigateTo} activeRoute={currentRoute} activeSection={activeSection} />

      <main className="flex-grow">
        {(currentRoute === 'home' || currentRoute === 'inspiration') && (
          <Home
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
            onSectionChange={setActiveSection}
            onHeroReady={handleHeroReady}
          />
        )}
        {currentRoute === 'shop' && <Shop onSelectProduct={handleSelectProduct} onNavigate={navigateTo} />}
        {currentRoute === 'collections' && <Collections onSelectCollection={handleSelectCollection} onNavigate={navigateTo} />}
        {currentRoute === 'collection-detail' && (
          <CollectionDetail
            slug={selectedCollectionSlug}
            onBack={() => navigateTo('collections-page')}
            onSelectProduct={handleSelectProduct}
            onSelectArticle={handleSelectArticle}
            onSelectCollection={handleSelectCollection}
          />
        )}
        {currentRoute === 'product' && <Product product={selectedProduct} onSelectProduct={handleSelectProduct} onNavigate={navigateTo} />}
        {currentRoute === 'journal' && <Blog onSelectArticle={handleSelectArticle} onNavigate={navigateTo} />}
        {currentRoute === 'article' && <Article article={selectedArticle} onBack={() => navigateTo('journal-page')} onSelectProduct={handleSelectProduct} onNavigate={navigateTo} />}
        {currentRoute === 'admin' && <Admin onNavigate={navigateTo} />}
      </main>

      <Footer onNavigate={navigateTo} />
      <CartDrawer />

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-sans border-l-4 border-bronze-500 animate-slideIn">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}

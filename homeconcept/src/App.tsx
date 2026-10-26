import { useState } from 'react';
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Armchair, ArrowUpRight, ClipboardList, Menu, Package, X } from 'lucide-react';
import { AppDataProvider } from './lib/context';
import { DashboardPage } from './pages/DashboardPage';
import { EnquiryPage } from './pages/EnquiryPage';
import { ProductsPage } from './pages/ProductsPage';
import { Brand } from './components/Brand';
import { useAppData } from './lib/context';

function Shell() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const { persistenceError } = useAppData();
  const isEnquiry = location.pathname.startsWith('/start') || location.pathname.startsWith('/enquiry');
  const nav = [
    { to: '/dashboard', label: 'Sales inbox', icon: ClipboardList },
    { to: '/products', label: 'Products', icon: Package },
  ];

  return (
    <div className="app-frame min-h-screen flex flex-col bg-[#f7f6f2]">
      <header className="topbar">
        <div className="topbar-inner">
          <Brand />
          <button className="icon-button mobile-menu-trigger" aria-label="Open menu" onClick={() => setMobileMenu((value) => !value)}>{mobileMenu ? <X size={20} /> : <Menu size={20} />}</button>
          <nav className={`main-nav ${mobileMenu ? 'nav-open' : ''}`} aria-label="Main navigation">
            {nav.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setMobileMenu(false)} className={({ isActive }) => `nav-link ${isActive && !isEnquiry ? 'active' : ''}`}><Icon size={16} strokeWidth={1.8} />{label}</NavLink>)}
            <NavLink to="/enquiry/luxe-3-seater-velvet-sofa" onClick={() => setMobileMenu(false)} className={`nav-link customer-link ${isEnquiry ? 'active' : ''}`}><Armchair size={16} strokeWidth={1.8} />Customer view<ArrowUpRight size={13} /></NavLink>
          </nav>
          <div className="workspace-badge"><span className="live-dot" />Workspace <span className="badge-divider">/</span> Lagos</div>
        </div>
      </header>
      <main className="page-shell">
        {persistenceError && <div className="storage-warning" role="alert">{persistenceError}</div>}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/start" element={<EnquiryPage />} />
          <Route path="/enquiry/:productSlug" element={<EnquiryPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <footer className="site-footer"><span>HomeConcept SalesBrief</span><span>Thoughtful service, from first hello to delivery.</span><span>Prototype · 2026</span></footer>
    </div>
  );
}

export default function App() {
  return <AppDataProvider><BrowserRouter><Shell /></BrowserRouter></AppDataProvider>;
}

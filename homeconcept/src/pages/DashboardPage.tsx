import { useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowLeft, ArrowUpRight, Check, ChevronDown, ChevronRight, Clipboard, Clock3, FileText, MapPin, MessageCircle, Plus, Search, Send, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppData } from '../lib/context';
import { createWhatsAppReply, getBriefSummary, getMissingInfo, getRecommendedActions } from '../lib/briefGeneration';
import type { Enquiry, EnquiryStatus } from '../lib/types';

const statuses: EnquiryStatus[] = ['New', 'Brief Ready', 'Quoted', 'Closed'];
const statusClass = (status: EnquiryStatus) => status.toLowerCase().replace(' ', '-');
const formattedTime = (iso: string) => new Intl.DateTimeFormat('en-NG', { hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short' }).format(new Date(iso));
const whatsappUrl = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  const international = digits.startsWith('0') ? `234${digits.slice(1)}` : digits.startsWith('234') ? digits : `234${digits}`;
  return `https://wa.me/${international}`;
};

export function DashboardPage() {
  const { database, updateStatus, markQuoteSent } = useAppData();
  const [selectedId, setSelectedId] = useState(database.enquiries[0]?.id ?? '');
  const [filter, setFilter] = useState<'All' | EnquiryStatus>('All');
  const [search, setSearch] = useState('');
  const [mobileDetail, setMobileDetail] = useState(false);
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState(false);
  const selected = database.enquiries.find((item) => item.id === selectedId) ?? database.enquiries[0];
  const visibleEnquiries = useMemo(() => database.enquiries.filter((item) => (filter === 'All' || item.status === filter) && `${item.customerName} ${item.productName} ${item.answers.state} ${item.answers.area}`.toLowerCase().includes(search.toLowerCase())), [database.enquiries, filter, search]);
  const counts = useMemo(() => statuses.reduce((result, status) => ({ ...result, [status]: database.enquiries.filter((item) => item.status === status).length }), {} as Record<EnquiryStatus, number>), [database.enquiries]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const copyText = async (text: string, success: string) => {
    try { await navigator.clipboard.writeText(text); notify(success); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { notify('Clipboard is unavailable in this browser.'); }
  };
  const handleQuote = (item: Enquiry) => {
    notify(updateStatus(item.id, 'Quoted') ? `${item.customerName.split(' ')[0]}’s enquiry marked as quoted.` : 'That status change could not be saved.');
  };
  const handleSendQuote = (item: Enquiry) => {
    notify(markQuoteSent(item.id) ? 'Simulation complete — a WhatsApp quote has been prepared for this customer.' : 'The quote could not be saved. Please retry before leaving this page.');
  };

  return <div className="dashboard-page">
    <div className="page-heading dashboard-heading">
      <div><div className="eyebrow"><span className="eyebrow-line" />MONDAY, 26 OCTOBER 2026</div><h1>Good morning, team<span className="title-period">.</span></h1><p className="page-subtitle">Every conversation is a chance to make someone feel at home.</p></div>
      <Link to="/enquiry/luxe-3-seater-velvet-sofa" className="button button-primary new-enquiry-button"><Plus size={16} />Try customer enquiry</Link>
    </div>
    <div className="overview-strip">
      <div className="overview-intro"><span className="overview-icon"><Users size={17} /></span><div><strong>{database.enquiries.length} conversations</strong><span>Your sales pipeline at a glance</span></div></div>
      <div className="overview-divider" />
      {statuses.slice(0, 3).map((status) => <button key={status} onClick={() => setFilter(filter === status ? 'All' : status)} className={`overview-stat ${filter === status ? 'overview-stat-active' : ''}`}><span className={`status-dot dot-${statusClass(status)}`} /><strong>{counts[status]}</strong><span>{status === 'Brief Ready' ? 'Brief ready' : status}</span></button>)}
      <span className="overview-asof"><Clock3 size={13} /> Updated just now</span>
    </div>

    <div className={`dashboard-workspace ${mobileDetail ? 'showing-detail' : ''}`}>
      <aside className="inbox-panel">
        <div className="inbox-title-row"><div><h2>Enquiries</h2><span>{visibleEnquiries.length} conversations</span></div><button className="icon-button quiet-icon" aria-label="New enquiry" onClick={() => window.location.assign('/enquiry/luxe-3-seater-velvet-sofa')}><Plus size={18} /></button></div>
        <label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers..." /></label>
        <div className="filter-tabs" aria-label="Filter enquiries">{(['All', ...statuses] as const).map((status) => <button key={status} className={filter === status ? 'selected' : ''} onClick={() => setFilter(status)}>{status === 'Brief Ready' ? 'Ready' : status}</button>)}</div>
        <div className="inbox-list">
          {visibleEnquiries.map((item) => <EnquiryCard key={item.id} enquiry={item} selected={selected?.id === item.id} onSelect={() => { setSelectedId(item.id); setMobileDetail(true); }} />)}
          {visibleEnquiries.length === 0 && <div className="empty-list"><Search size={20} /><p>No enquiries match that search.</p><button onClick={() => { setSearch(''); setFilter('All'); }}>Clear filters</button></div>}
        </div>
        <div className="inbox-footnote"><span className="live-dot" />Synced to this workspace</div>
      </aside>

      {selected ? <article className="brief-panel" id="print-area">
        <div className="mobile-back-row"><button onClick={() => setMobileDetail(false)} className="text-button"><ArrowLeft size={15} />Back to enquiries</button></div>
        <div className="brief-topline"><div className="brief-type"><span className="brief-icon"><FileText size={16} /></span><div><span>SALES BRIEF</span><small>Auto-prepared · {formattedTime(selected.submittedAt)}</small></div></div><div className="brief-top-actions"><span className={`status-pill status-${statusClass(selected.status)}`}><i />{selected.status}</span><button className="icon-button print-action" aria-label="Copy brief as PDF" title="Copy brief as PDF / print to PDF" onClick={() => window.print()}><ArrowDownToLine size={16} /></button></div></div>
        <header className="brief-header"><div className="brief-kicker">HOME CONCEPT SALES BRIEF</div><h2>{selected.customerName}<span>’s enquiry</span></h2><div className="brief-meta"><span><MapPin size={13} />{[selected.answers.area, selected.answers.state].filter(Boolean).join(', ') || 'Location to confirm'}</span><span className="meta-dot">·</span><span>via {selected.source}</span><span className="meta-dot">·</span><span>{formattedTime(selected.submittedAt)}</span></div></header>

        <section className="brief-section customer-overview"><div className="customer-avatar">{selected.customerName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div className="customer-info"><span className="field-eyebrow">CUSTOMER</span><strong>{selected.customerName}</strong><a href={whatsappUrl(selected.phone)} target="_blank" rel="noreferrer"><MessageCircle size={14} />{selected.phone} <ArrowUpRight size={12} /></a></div><div className="source-stamp"><span>ENQUIRY SOURCE</span><strong>{selected.source}</strong></div></section>

        <section className="product-interest-card"><img src={selected.productImage || '/images/velvet-sofa.jpg'} alt={selected.productName} /><div><span className="field-eyebrow">PRODUCT OF INTEREST</span><strong>{selected.productName}</strong><span>Made for considered living</span></div><ChevronRight size={17} className="product-chevron" /></section>

        <section className="brief-section generated-summary"><div className="section-label"><span className="sparkle-icon"><Sparkles size={14} /></span><h3>Brief summary</h3><span className="ai-label">AI GENERATED</span></div><p>{getBriefSummary(selected)}</p></section>

        <section className="brief-section key-details-section"><div className="section-heading"><span className="section-index">01</span><h3>Key details</h3></div><div className="details-table">
          <Detail label="Space" value={[selected.answers.roomType, selected.answers.dimensions].filter(Boolean).join(' · ') || 'To confirm'} />
          <Detail label="Style" value={selected.answers.style || 'To discover'} />
          <Detail label="Color / material" value={selected.answers.colorMaterial || 'To discover'} />
          <Detail label="Budget" value={selected.answers.budget || 'Not confirmed'} highlight={!selected.answers.budget} />
          <Detail label="Delivery" value={[[selected.answers.area, selected.answers.state].filter(Boolean).join(', '), selected.answers.floor].filter(Boolean).join(' · ') || 'Details to confirm'} />
          <Detail label="Timeline" value={selected.answers.timeline || 'To confirm'} />
        </div></section>

        <section className="brief-section"><div className="section-heading"><span className="section-index">02</span><h3>Missing info / red flags</h3><span className="section-count">{getMissingInfo(selected).length}</span></div>{getMissingInfo(selected).length ? <div className="flag-list">{getMissingInfo(selected).map((flag) => <div className="flag-row" key={flag}><span className="flag-symbol">!</span><p>{flag}</p></div>)}</div> : <div className="clear-state"><Check size={15} />All key details are in place.</div>}</section>

        <section className="brief-section recommendations-section"><div className="section-heading"><span className="section-index">03</span><h3>Recommended actions for staff</h3></div><div className="recommendations-list">{getRecommendedActions(selected).map((action, index) => <div className="recommendation-row" key={action}><span>{String(index + 1).padStart(2, '0')}</span><p>{action}</p><ChevronRight size={15} /></div>)}</div></section>

        <details className="transcript-section"><summary><span><MessageCircle size={15} />Full chat transcript</span><ChevronDown size={16} className="transcript-chevron" /></summary><div className="transcript-body">{selected.transcript.map((message, index) => <div className={`transcript-line ${message.role}`} key={`${index}-${message.text}`}><span>{message.role === 'assistant' ? 'HOME CONCEPT' : selected.customerName.split(' ')[0]}</span><p>{message.text}</p></div>)}</div></details>

        <div className="brief-actions"><button className="button button-secondary" onClick={() => copyText(createWhatsAppReply(selected), copied ? 'Reply copied.' : 'Personalized WhatsApp reply copied.')}><Clipboard size={15} />Create WhatsApp Reply</button><button className="button button-primary" onClick={() => handleSendQuote(selected)}><Send size={15} />{selected.quoteSent ? 'WhatsApp quote sent' : 'Send Quote via WhatsApp'}</button></div>
        <div className="brief-bottom-actions"><button className="text-button" onClick={() => copyText(getBriefSummary(selected), 'Brief summary copied.')}>Copy brief summary</button>{selected.status !== 'Quoted' && selected.status !== 'Closed' && <button className="text-button mark-quoted" onClick={() => handleQuote(selected)}><Check size={14} />Mark as Quoted</button>}<label className="status-select-label">Status<select value={selected.status} onChange={(event) => updateStatus(selected.id, event.target.value as EnquiryStatus)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label></div>
      </article> : <div className="brief-panel empty-detail"><FileText size={28} /><h2>Your next great conversation starts here.</h2><p>Select an enquiry to open its sales brief.</p></div>}
    </div>
    {toast && <div className="toast-message"><Check size={16} />{toast}</div>}
  </div>;
}

function EnquiryCard({ enquiry, selected, onSelect }: { enquiry: Enquiry; selected: boolean; onSelect: () => void }) {
  return <button onClick={onSelect} className={`enquiry-card ${selected ? 'card-selected' : ''}`}>
    <span className="customer-initial">{enquiry.customerName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>
    <span className="enquiry-card-content"><span className="enquiry-card-name">{enquiry.customerName}<time>{formattedTime(enquiry.submittedAt)}</time></span><span className="enquiry-card-product">{enquiry.productName}</span><span className="enquiry-card-bottom"><span>{enquiry.answers.budget || 'Budget open'}</span><span className={`tiny-status status-${statusClass(enquiry.status)}`}><i />{enquiry.status}</span></span></span>
    <ChevronRight className="card-arrow" size={15} />
  </button>;
}

function Detail({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div className="detail-cell"><span>{label}</span><strong className={highlight ? 'missing-value' : ''}>{value}</strong></div>;
}

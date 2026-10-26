import { useState, type FormEvent } from 'react';
import { ArrowUpRight, ImagePlus, Package, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppData } from '../lib/context';
import { formatNaira } from '../lib/briefGeneration';
import type { Product } from '../lib/types';

const blank: Product = { id: '', name: '', price: 0, category: '', imageUrl: '' };

export function ProductsPage() {
  const { database, saveProduct, deleteProduct } = useAppData();
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const visible = database.products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase()));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    if (!saveProduct({ ...editing, id: editing.id || `product-${Date.now()}`, price: Number(editing.price) })) {
      setNotice('The product could not be saved. Free some browser storage and try again.');
      window.setTimeout(() => setNotice(''), 3600);
      return;
    }
    setEditing(null);
    setNotice('Product saved to the catalogue.');
    window.setTimeout(() => setNotice(''), 2400);
  };

  const remove = (product: Product) => {
    if (window.confirm(`Remove ${product.name} from the product catalogue?`)) deleteProduct(product.id);
  };

  return <div className="products-page">
    <div className="page-heading products-heading">
      <div>
        <div className="eyebrow"><span className="eyebrow-line" />YOUR SHOWROOM CATALOGUE</div>
        <h1>Pieces with a story<span className="title-period">.</span></h1>
        <p className="page-subtitle">Keep the collection current, so every recommendation feels considered.</p>
      </div>
      <button className="button button-primary" onClick={() => setEditing({ ...blank })}><Plus size={16} />Add a product</button>
    </div>

    <div className="catalogue-toolbar">
      <div className="catalogue-count">
        <span className="catalogue-icon"><Package size={17} /></span>
        <div><strong>{database.products.length} pieces</strong><span>Available in your catalogue</span></div>
      </div>
      <label className="search-box product-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your collection..." /></label>
    </div>

    <div className="product-grid">
      {visible.map((product, index) => <article className="catalogue-card" key={product.id}>
        <div className="catalogue-photo-wrap">
          <img src={product.imageUrl || '/images/neutral-living.jpg'} alt={product.name} onError={(event) => { event.currentTarget.src = '/images/neutral-living.jpg'; }} />
          <span className="catalogue-index">{String(index + 1).padStart(2, '0')}</span>
          <div className="catalogue-actions">
            <button aria-label={`Edit ${product.name}`} onClick={() => setEditing({ ...product })}><Pencil size={15} /></button>
            <button aria-label={`Delete ${product.name}`} onClick={() => remove(product)}><Trash2 size={15} /></button>
          </div>
        </div>
        <div className="catalogue-card-body">
          <div className="catalogue-category">{product.category || 'Furniture'} <span>·</span> HOME CONCEPT</div>
          <h2>{product.name}</h2>
          <div className="catalogue-price"><strong>{formatNaira(product.price)}</strong><span>incl. VAT</span></div>
          <p>{product.description || 'A thoughtful piece for a more comfortable home.'}</p>
          <Link to={`/enquiry/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="catalogue-enquire">Preview customer enquiry <ArrowUpRight size={15} /></Link>
        </div>
      </article>)}
      <button className="add-catalogue-card" onClick={() => setEditing({ ...blank })}>
        <span><ImagePlus size={20} /></span><strong>Add a new piece</strong><small>Expand your collection</small><Plus size={17} className="add-card-plus" />
      </button>
    </div>

    {visible.length === 0 && <div className="empty-catalogue"><Search size={20} /><h3>No pieces found</h3><p>Try another search, or add a new product to your collection.</p></div>}
    <div className="catalogue-note"><span>COLLECTION NOTE</span><p>Your product list helps the enquiry assistant understand what customers are asking about. Product changes are saved in this browser.</p></div>

    {editing && <div className="modal-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}>
      <form className="product-modal" onSubmit={submit}>
        <div className="modal-heading">
          <div><span className="eyebrow"><span className="eyebrow-line" />PRODUCT DETAILS</span><h2>{editing.id ? 'Edit this piece' : 'Add a new piece'}</h2></div>
          <button className="icon-button" type="button" aria-label="Close" onClick={() => setEditing(null)}><X size={18} /></button>
        </div>
        <label>Product name<input required value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} placeholder="e.g. Luxe 3-Seater Velvet Sofa" /></label>
        <div className="modal-field-row">
          <label>Price in NGN<input required min="0" type="number" value={editing.price || ''} onChange={(event) => setEditing({ ...editing, price: Number(event.target.value) })} placeholder="680000" /></label>
          <label>Category<input required value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })} placeholder="Sofas" /></label>
        </div>
        <label>Image URL<input required type="text" value={editing.imageUrl} onChange={(event) => setEditing({ ...editing, imageUrl: event.target.value })} placeholder="https://… or /images/sofa.jpg" /></label>
        <label>Description <span className="optional-label">optional</span><textarea rows={3} value={editing.description || ''} onChange={(event) => setEditing({ ...editing, description: event.target.value })} placeholder="A short, inviting product note." /></label>
        <div className="modal-actions">
          <button type="button" className="button button-secondary" onClick={() => setEditing(null)}>Cancel</button>
          <button type="submit" className="button button-primary"><Plus size={15} />Save product</button>
        </div>
      </form>
    </div>}
    {notice && <div className="toast-message"><Package size={16} />{notice}</div>}
  </div>;
}

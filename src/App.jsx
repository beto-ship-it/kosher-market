import { useState, useMemo, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  // Identity
  storeName: "Kosher Market",
  storeSlogan: "Kosher · Fresco · Confiable",
  logoUrl: "",
  logoEmoji: "✡",
  faviconEmoji: "✡",

  // Contact
  whatsappNumber: "5491169600924",
  whatsappMessage: `🛒 *Pedido — {{storeName}}*\n\n{{items}}\n\n💰 *Total estimado: {{total}}*\n_Algunos precios pueden variar por peso exacto_\n\n📋 *Mis datos:*\nNombre:\nDirección:\nHorario:\nPago:`,

  // Colors
  colorPrimary: "#0f4c35",
  colorPrimaryLight: "#e8f5e9",
  colorAccent: "#22c55e",
  colorBg: "#f5f7f5",
  colorCard: "#ffffff",
  colorText: "#1a2e1a",
  colorTextMuted: "#7a8a7a",
  colorBorder: "#dde4dd",
  colorHeader: "#0f4c35",
  colorHeaderText: "#e8f5e9",
  colorPriceTag: "#0f4c35",
  colorBadgeNew: "#0ea5e9",
  colorBadgeOffer: "#ef4444",
  colorBadgeTop: "#d97706",
  colorBadgeShabat: "#6366f1",
  colorWhatsapp: "#25d366",
  colorCartBtn: "#0f4c35",

  // Typography
  fontDisplay: "Cormorant Garamond",
  fontBody: "DM Sans",
  fontSizeBase: "14",
  fontSizeProduct: "13",
  fontSizePrice: "16",
  letterSpacingLogo: "0.02em",

  // Layout
  productColumns: "auto", // auto | 2 | 3 | 4
  cardRadius: "14",
  cardShadow: "soft", // none | soft | medium | strong
  imageAspect: "1/1", // 1/1 | 4/3 | 16/9
  showDescriptions: true,
  showUnits: true,

  // Banner
  bannerEnabled: true,
  bannerTitle: "Especiales\nde Shabat",
  bannerSubtitle: "Jalot, vinos y carnes seleccionadas",
  bannerBtnText: "Ver productos →",
  bannerBtnFilter: "shabat",
  bannerBgFrom: "#0f4c35",
  bannerBgTo: "#1a6b4a",
  bannerTextColor: "#e8f5e9",
  bannerTag: "✡ Esta semana",
  bannerImageUrl: "",

  // Footer
  footerText: "© 2025 Kosher Market · Todos los precios son estimados",
  footerBg: "#0f4c35",
  footerTextColor: "#7dc89a",

  // Admin
  adminPassword: "admin123",
};

const DEFAULT_CATEGORIES = [
  { id: "carnes",    name: "Carnes",     icon: "🥩", active: true, order: 1 },
  { id: "lacteos",   name: "Lácteos",    icon: "🧀", active: true, order: 2 },
  { id: "congelados",name: "Congelados", icon: "❄️", active: true, order: 3 },
  { id: "jalot",     name: "Jalot",      icon: "🍞", active: true, order: 4 },
  { id: "bebidas",   name: "Bebidas",    icon: "🥤", active: true, order: 5 },
  { id: "snacks",    name: "Snacks",     icon: "🍿", active: true, order: 6 },
  { id: "vinos",     name: "Vinos",      icon: "🍷", active: true, order: 7 },
  { id: "limpieza",  name: "Limpieza",   icon: "🧼", active: true, order: 8 },
];

const DEFAULT_TAGS = [
  { id: "nuevo",       label: "Nuevo",    bg: "#0ea5e9", color: "#fff", active: true },
  { id: "oferta",      label: "Oferta",   bg: "#ef4444", color: "#fff", active: true },
  { id: "recomendado", label: "★ Top",    bg: "#d97706", color: "#fff", active: true },
  { id: "shabat",      label: "✡ Shabat", bg: "#6366f1", color: "#fff", active: true },
];

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Pechuga de Pollo",   category: "carnes",    price: 4200, unit: "por kg",      description: "Fresca, sin piel, supervisión Vaad Harabanim", image: "https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=500&q=80", tags: ["recomendado"], variants: ["500gr — $2.100","1kg — $4.200","2kg — $7.800"], active: true, order: 1, originalPrice: null },
  { id: 2, name: "Salmón Fresco",      category: "carnes",    price: 8900, unit: "por kg",      description: "Importado, corte filet, sin espinas",              image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80", tags: ["nuevo","shabat"],    variants: ["300gr — $2.670","500gr — $4.450","1kg — $8.900"], active: true, order: 2, originalPrice: null },
  { id: 3, name: "Asado Vacuno",       category: "carnes",    price: 6800, unit: "por kg",      description: "Corte parrilla, chalav Israel, ideal para Shabat",  image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&q=80", tags: ["oferta","shabat"],   variants: ["1kg — $6.800","2kg — $12.500"], active: true, order: 3, originalPrice: 7500 },
  { id: 4, name: "Jalá Trenzada",      category: "jalot",     price: 1800, unit: "por unidad",  description: "Horneada artesanalmente para Shabat, receta tradicional", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80", tags: ["shabat","recomendado"], variants: ["Chica — $1.200","Grande — $1.800","Con semillas — $2.000"], active: true, order: 1, originalPrice: null },
  { id: 5, name: "Leche Entera",       category: "lacteos",   price: 980,  unit: "por litro",   description: "Chalav Israel, pasteurizada, sin conservantes",     image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80", tags: [],                    variants: ["1L — $980","2L — $1.800"], active: true, order: 1, originalPrice: null },
  { id: 6, name: "Queso Brie",         category: "lacteos",   price: 3200, unit: "por pieza",   description: "Importado 250gr, chalav Israel, cremoso y suave",  image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&q=80", tags: ["recomendado"],       variants: ["250gr — $3.200"], active: true, order: 2, originalPrice: null },
  { id: 7, name: "Vino Carmel Reserva",category: "vinos",     price: 4500, unit: "por botella", description: "Tinto Reserva, Yayin Mevushal, ideal para Kidush",  image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80", tags: ["shabat","recomendado"], variants: ["750ml — $4.500"], active: true, order: 1, originalPrice: null },
  { id: 8, name: "Knishes de Papa",    category: "congelados",price: 2400, unit: "por 6 unid.", description: "Listos para calentar, relleno casero artesanal",   image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80", tags: ["recomendado"],       variants: ["6 unid. — $2.400","12 unid. — $4.500"], active: true, order: 1, originalPrice: null },
  { id: 9, name: "Bamba",              category: "snacks",    price: 890,  unit: "por pack",    description: "Snack israelí clásico de maní, el favorito de siempre", image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500&q=80", tags: ["recomendado"],   variants: ["Grande — $890","Pack x3 — $2.400"], active: true, order: 1, originalPrice: null },
  { id: 10, name: "Agua Mineral",      category: "bebidas",   price: 420,  unit: "por unidad",  description: "Sin gas, 1.5L, pureza garantizada",                image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&q=80", tags: [],                    variants: ["1.5L — $420","Pack x6 — $2.200"], active: true, order: 1, originalPrice: null },
];

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────────────────────
function load(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function fmt(n) { return "$" + Number(n).toLocaleString("es-AR"); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function variantPrice(product, variant) {
  if (!variant) return product.price;
  const m = variant.match(/\$([\d.]+)/);
  if (!m) return product.price;
  return parseFloat(m[1].replace(/\./g, "")) || product.price;
}

function buildWAMsg(items, cfg) {
  const lines = items.map(i => {
    const p = variantPrice(i.product, i.variant);
    const vl = i.variant ? ` (${i.variant.split("—")[0].trim()})` : "";
    return `• ${i.qty}x ${i.product.name}${vl} — ${fmt(p * i.qty)}`;
  });
  const total = items.reduce((s, i) => s + variantPrice(i.product, i.variant) * i.qty, 0);
  const msg = cfg.whatsappMessage
    .replace("{{storeName}}", cfg.storeName)
    .replace("{{items}}", lines.join("\n"))
    .replace("{{total}}", fmt(total));
  return `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

const FONT_OPTIONS = [
  "Cormorant Garamond","Playfair Display","DM Sans","Nunito","Lato",
  "Merriweather","Josefin Sans","Raleway","Libre Baskerville","Montserrat",
  "EB Garamond","Spectral","Crimson Pro","Work Sans","Outfit",
];

const SHADOW_MAP = {
  none:   "none",
  soft:   "0 1px 4px rgba(0,0,0,0.06)",
  medium: "0 4px 16px rgba(0,0,0,0.10)",
  strong: "0 8px 30px rgba(0,0,0,0.16)",
};

// ─────────────────────────────────────────────────────────────────────────────
// TINY UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, size = 44 }) {
  return (
    <div onClick={() => onChange(!checked)} style={{ width: size, height: size * 0.545, borderRadius: size, background: checked ? "#0f4c35" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: "14%", left: checked ? "52%" : "6%", width: "42%", aspectRatio: "1", borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
    </div>
  );
}

function ColorField({ label, value, onChange, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#3a5a3a", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative", width: 40, height: 36, borderRadius: 8, overflow: "hidden", border: "1.5px solid #dde4dd", flexShrink: 0 }}>
          <input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ position: "absolute", inset: "-4px", width: "calc(100%+8px)", height: "calc(100%+8px)", cursor: "pointer", border: "none", padding: 0 }} />
        </div>
        <input value={value} onChange={e => onChange(e.target.value)} style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1.5px solid #dde4dd", fontSize: 13, color: "#1a2e1a", fontFamily: "monospace", outline: "none" }} />
      </div>
      {hint && <div style={{ fontSize: 11, color: "#7a8a7a", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, hint, multiline, options, min, max }) {
  const base = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #dde4dd", fontSize: 14, color: "#1a2e1a", outline: "none", fontFamily: "inherit", background: "#fff" };
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: "#3a5a3a", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>}
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={base}>
          {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
      ) : multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...base, resize: "vertical", minHeight: 80 }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} min={min} max={max} style={base} />
      )}
      {hint && <div style={{ fontSize: 11, color: "#7a8a7a", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 18, paddingBottom: 10, borderBottom: "1.5px solid #eef0ee" }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: "#1a2e1a" }}>{children}</div>
      {sub && <div style={{ fontSize: 12, color: "#7a8a7a", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function SaveBar({ onSave, saved }) {
  return (
    <div style={{ position: "sticky", bottom: 0, background: "#fff", borderTop: "1.5px solid #eef0ee", padding: "12px 20px", display: "flex", justifyContent: "flex-end" }}>
      <button onClick={onSave} style={{ padding: "11px 28px", borderRadius: 11, border: "none", background: saved ? "#22c55e" : "#0f4c35", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background .3s", fontFamily: "inherit" }}>
        {saved ? "✓ Guardado" : "Guardar cambios"}
      </button>
    </div>
  );
}

function Badge({ tag }) {
  return <span style={{ background: tag.bg, color: tag.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, letterSpacing: ".03em", whiteSpace: "nowrap" }}>{tag.label}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

// --- PRODUCTS TAB ---
function ProductsTab({ products, categories, tags, onSave }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // null = list, "new" = new, id = edit
  const [form, setForm] = useState({});
  const [varInput, setVarInput] = useState("");
  const [saved, setSaved] = useState(false);

  const EMPTY = { name: "", category: categories[0]?.id || "", price: "", unit: "por unidad", description: "", image: "", tags: [], variants: [], active: true, originalPrice: null };

  function openEdit(p) { setForm({ ...p }); setEditing(p.id); setVarInput(""); }
  function openNew() { setForm({ ...EMPTY }); setEditing("new"); setVarInput(""); }

  function handleSave() {
    if (!form.name || !form.price) return;
    const np = { ...form, id: editing === "new" ? uid() : editing, price: parseFloat(form.price), originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null };
    const updated = editing === "new" ? [...products, np] : products.map(p => p.id === np.id ? np : p);
    onSave(updated);
    setSaved(true); setTimeout(() => { setSaved(false); setEditing(null); }, 1000);
  }

  function toggleActive(id) { onSave(products.map(p => p.id === id ? { ...p, active: !p.active } : p)); }
  function duplicate(p) { onSave([...products, { ...p, id: uid(), name: p.name + " (copia)" }]); }
  function del(id) { if (confirm("¿Eliminar producto?")) onSave(products.filter(p => p.id !== id)); }
  function addVar() { if (!varInput.trim()) return; setForm(f => ({ ...f, variants: [...f.variants, varInput.trim()] })); setVarInput(""); }
  function removeVar(i) { setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) })); }
  function toggleTag(tid) { setForm(f => ({ ...f, tags: f.tags.includes(tid) ? f.tags.filter(t => t !== tid) : [...f.tags, tid] })); }

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));
  const inp = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #dde4dd", fontSize: 14, color: "#1a2e1a", outline: "none", fontFamily: "inherit", background: "#fff" };
  const lbl = { fontSize: 11, fontWeight: 700, color: "#3a5a3a", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" };

  if (editing !== null) return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => setEditing(null)} style={{ background: "#f0f4f0", border: "none", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13, color: "#3a5a3a" }}>← Volver</button>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#1a2e1a" }}>{editing === "new" ? "Nuevo producto" : "Editar producto"}</div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #eef0ee", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ marginBottom: 12 }}><label style={lbl}>Nombre *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Pechuga de Pollo" style={inp} /></div>
          <div style={{ marginBottom: 12 }}><label style={lbl}>Descripción</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe el producto brevemente..." style={{ ...inp, minHeight: 68, resize: "vertical" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div><label style={lbl}>Precio base *</label><input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="4200" style={inp} /></div>
            <div><label style={lbl}>Precio anterior (oferta)</label><input type="number" value={form.originalPrice || ""} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value || null }))} placeholder="Vacío = sin oferta" style={inp} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div><label style={lbl}>Unidad</label>
              <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} style={inp}>
                {["por unidad","por kg","por litro","por 6 unid.","por 12 unid.","por pack","por pieza","por botella"].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Categoría</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inp}>
                {categories.filter(c => c.active).map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>URL de foto</label>
            <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://... pegá el link de la imagen" style={inp} />
            {form.image && <div style={{ marginTop: 8, height: 110, borderRadius: 10, overflow: "hidden", background: "#f3f5f2" }}><img src={form.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.currentTarget.style.opacity = ".3"} /></div>}
            <div style={{ fontSize: 11, color: "#7a8a7a", marginTop: 5 }}>💡 Subí la foto a <a href="https://imgur.com" target="_blank" style={{ color: "#0f4c35" }}>imgur.com</a> → clic derecho → "Copiar dirección de imagen" → pegá acá</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>Etiquetas</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tags.filter(t => t.active).map(t => (
                <button key={t.id} onClick={() => toggleTag(t.id)} style={{ padding: "6px 14px", borderRadius: 20, border: `2px solid ${form.tags?.includes(t.id) ? t.bg : "#dde4dd"}`, background: form.tags?.includes(t.id) ? t.bg : "#fff", color: form.tags?.includes(t.id) ? t.color : "#7a8a7a", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>{t.label}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Variantes / Presentaciones</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <input value={varInput} onChange={e => setVarInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addVar()} placeholder='Ej: 500gr — $2.100' style={{ ...inp, flex: 1 }} />
              <button onClick={addVar} style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "#0f4c35", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+</button>
            </div>
            <div style={{ fontSize: 11, color: "#7a8a7a", marginBottom: 8 }}>Formato sugerido: "500gr — $2.100" · Enter o + para agregar</div>
            {form.variants?.map((v, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, background: "#f5f7f5", borderRadius: 8, padding: "8px 12px" }}>
                <span style={{ flex: 1, fontSize: 13 }}>{v}</span>
                <button onClick={() => removeVar(i)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid #eef0ee", marginBottom: 16 }}>
            <div><div style={{ fontSize: 14, fontWeight: 700 }}>Producto activo</div><div style={{ fontSize: 12, color: "#7a8a7a" }}>Visible en la tienda</div></div>
            <Toggle checked={form.active} onChange={v => setForm(f => ({ ...f, active: v }))} />
          </div>
          <button onClick={handleSave} style={{ width: "100%", padding: 15, borderRadius: 13, border: "none", background: saved ? "#22c55e" : "#0f4c35", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "background .3s", fontFamily: "inherit" }}>
            {saved ? "✓ Guardado" : editing === "new" ? "Agregar producto" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar..." style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1.5px solid #dde4dd", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
        <button onClick={openNew} style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "#0f4c35", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>+ Nuevo</button>
      </div>
      <div style={{ fontSize: 12, color: "#7a8a7a", marginBottom: 10 }}>{filtered.length} productos</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 12, padding: "11px 13px", border: "1px solid #eef0ee", display: "flex", alignItems: "center", gap: 11, opacity: p.active ? 1 : .5 }}>
            <img src={p.image} style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 8, flexShrink: 0, background: "#f3f5f2" }} onError={e => e.currentTarget.style.opacity = ".3"} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2e1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#0f4c35", fontWeight: 700 }}>{fmt(p.price)} <span style={{ color: "#aaa", fontWeight: 400 }}>· {categories.find(c => c.id === p.category)?.name || p.category}</span></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <Toggle checked={p.active} onChange={() => toggleActive(p.id)} size={36} />
              <button onClick={() => openEdit(p)} style={{ padding: "5px 9px", borderRadius: 7, border: "1px solid #dde4dd", background: "#fff", cursor: "pointer", fontSize: 13 }}>✏️</button>
              <button onClick={() => duplicate(p)} style={{ padding: "5px 9px", borderRadius: 7, border: "1px solid #dde4dd", background: "#fff", cursor: "pointer", fontSize: 13 }} title="Duplicar">⧉</button>
              <button onClick={() => del(p.id)} style={{ padding: "5px 9px", borderRadius: 7, border: "1px solid #fecaca", background: "#fff", cursor: "pointer", fontSize: 13, color: "#ef4444" }}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- CATEGORIES TAB ---
function CategoriesTab({ categories, onSave }) {
  const [items, setItems] = useState(categories);
  const [saved, setSaved] = useState(false);
  const [newName, setNewName] = useState(""); const [newIcon, setNewIcon] = useState("🛒");
  const inp = { padding: "9px 12px", borderRadius: 9, border: "1.5px solid #dde4dd", fontSize: 14, outline: "none", fontFamily: "inherit", background: "#fff" };

  function add() {
    if (!newName.trim()) return;
    setItems(prev => [...prev, { id: uid(), name: newName.trim(), icon: newIcon, active: true, order: prev.length + 1 }]);
    setNewName(""); setNewIcon("🛒");
  }
  function remove(id) { setItems(prev => prev.filter(c => c.id !== id)); }
  function update(id, field, val) { setItems(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c)); }
  function handleSave() { onSave(items); setSaved(true); setTimeout(() => setSaved(false), 1500); }

  return (
    <div style={{ padding: 16, maxWidth: 560, margin: "0 auto" }}>
      <SectionTitle sub="Las categorías aparecen como filtros en la barra superior de la tienda">Categorías</SectionTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={newIcon} onChange={e => setNewIcon(e.target.value)} style={{ ...inp, width: 56, textAlign: "center", fontSize: 20 }} placeholder="🛒" />
        <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Nombre de categoría" style={{ ...inp, flex: 1 }} />
        <button onClick={add} style={{ padding: "9px 16px", borderRadius: 9, border: "none", background: "#0f4c35", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {items.map(c => (
          <div key={c.id} style={{ background: "#fff", borderRadius: 11, padding: "10px 13px", border: "1px solid #eef0ee", display: "flex", alignItems: "center", gap: 10, opacity: c.active ? 1 : .5 }}>
            <input value={c.icon} onChange={e => update(c.id, "icon", e.target.value)} style={{ ...inp, width: 44, textAlign: "center", fontSize: 18, padding: "6px" }} />
            <input value={c.name} onChange={e => update(c.id, "name", e.target.value)} style={{ ...inp, flex: 1 }} />
            <Toggle checked={c.active} onChange={v => update(c.id, "active", v)} size={36} />
            <button onClick={() => remove(c.id)} style={{ padding: "6px 9px", borderRadius: 7, border: "1px solid #fecaca", background: "#fff", color: "#ef4444", cursor: "pointer", fontSize: 13 }}>🗑</button>
          </div>
        ))}
      </div>
      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}

// --- TAGS TAB ---
function TagsTab({ tags, onSave }) {
  const [items, setItems] = useState(tags);
  const [saved, setSaved] = useState(false);
  const inp = { padding: "9px 12px", borderRadius: 9, border: "1.5px solid #dde4dd", fontSize: 14, outline: "none", fontFamily: "inherit", background: "#fff" };

  function add() {
    setItems(prev => [...prev, { id: uid(), label: "Nueva etiqueta", bg: "#6366f1", color: "#fff", active: true }]);
  }
  function remove(id) { setItems(prev => prev.filter(t => t.id !== id)); }
  function update(id, field, val) { setItems(prev => prev.map(t => t.id === id ? { ...t, [field]: val } : t)); }
  function handleSave() { onSave(items); setSaved(true); setTimeout(() => setSaved(false), 1500); }

  return (
    <div style={{ padding: 16, maxWidth: 560, margin: "0 auto" }}>
      <SectionTitle sub="Las etiquetas son los badges de colores que aparecen sobre los productos">Etiquetas</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {items.map(t => (
          <div key={t.id} style={{ background: "#fff", borderRadius: 12, padding: "13px 14px", border: "1px solid #eef0ee" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Badge tag={t} />
              <Toggle checked={t.active} onChange={v => update(t.id, "active", v)} size={36} />
              <button onClick={() => remove(t.id)} style={{ marginLeft: "auto", padding: "5px 9px", borderRadius: 7, border: "1px solid #fecaca", background: "#fff", color: "#ef4444", cursor: "pointer", fontSize: 13 }}>🗑</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: 10 }}>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "#3a5a3a", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>Texto</div><input value={t.label} onChange={e => update(t.id, "label", e.target.value)} style={inp} /></div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#3a5a3a", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>Fondo</div>
                <div style={{ position: "relative", height: 38, borderRadius: 9, overflow: "hidden", border: "1.5px solid #dde4dd" }}>
                  <input type="color" value={t.bg} onChange={e => update(t.id, "bg", e.target.value)} style={{ position: "absolute", inset: "-4px", width: "calc(100%+8px)", height: "calc(100%+8px)", cursor: "pointer", border: "none" }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#3a5a3a", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>Texto</div>
                <div style={{ position: "relative", height: 38, borderRadius: 9, overflow: "hidden", border: "1.5px solid #dde4dd" }}>
                  <input type="color" value={t.color} onChange={e => update(t.id, "color", e.target.value)} style={{ position: "absolute", inset: "-4px", width: "calc(100%+8px)", height: "calc(100%+8px)", cursor: "pointer", border: "none" }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={add} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "1.5px dashed #dde4dd", background: "#fff", color: "#3a5a3a", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: 14, marginBottom: 16 }}>+ Agregar etiqueta</button>
      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}

// --- DESIGN TAB ---
function DesignTab({ cfg, onSave }) {
  const [local, setLocal] = useState(cfg);
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setLocal(prev => ({ ...prev, [k]: v }));
  function handleSave() { onSave(local); setSaved(true); setTimeout(() => setSaved(false), 1500); }

  const fontLink = `https://fonts.googleapis.com/css2?family=${local.fontDisplay.replace(/ /g,"+")}:wght@600;700&family=${local.fontBody.replace(/ /g,"+")}:wght@400;500;700;800&display=swap`;

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>

      {/* COLORS */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #eef0ee", marginBottom: 16 }}>
        <SectionTitle sub="Colores principales de la tienda">🎨 Colores</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <ColorField label="Color principal" value={local.colorPrimary} onChange={v => set("colorPrimary", v)} hint="Header, botones, precios" />
          <ColorField label="Color claro principal" value={local.colorPrimaryLight} onChange={v => set("colorPrimaryLight", v)} hint="Fondos suaves y chips" />
          <ColorField label="Color acento" value={local.colorAccent} onChange={v => set("colorAccent", v)} hint="Confirmaciones y éxito" />
          <ColorField label="Fondo general" value={local.colorBg} onChange={v => set("colorBg", v)} />
          <ColorField label="Fondo tarjetas" value={local.colorCard} onChange={v => set("colorCard", v)} />
          <ColorField label="Texto principal" value={local.colorText} onChange={v => set("colorText", v)} />
          <ColorField label="Texto secundario" value={local.colorTextMuted} onChange={v => set("colorTextMuted", v)} />
          <ColorField label="Bordes" value={local.colorBorder} onChange={v => set("colorBorder", v)} />
          <ColorField label="Header fondo" value={local.colorHeader} onChange={v => set("colorHeader", v)} />
          <ColorField label="Header texto" value={local.colorHeaderText} onChange={v => set("colorHeaderText", v)} />
          <ColorField label="Precios" value={local.colorPriceTag} onChange={v => set("colorPriceTag", v)} />
          <ColorField label="Botón WhatsApp" value={local.colorWhatsapp} onChange={v => set("colorWhatsapp", v)} />
        </div>
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#3a5a3a", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".06em" }}>Colores de etiquetas (badges)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <ColorField label="Nuevo" value={local.colorBadgeNew} onChange={v => set("colorBadgeNew", v)} />
            <ColorField label="Oferta" value={local.colorBadgeOffer} onChange={v => set("colorBadgeOffer", v)} />
            <ColorField label="Top" value={local.colorBadgeTop} onChange={v => set("colorBadgeTop", v)} />
            <ColorField label="Shabat" value={local.colorBadgeShabat} onChange={v => set("colorBadgeShabat", v)} />
          </div>
        </div>
      </div>

      {/* TYPOGRAPHY */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #eef0ee", marginBottom: 16 }}>
        <SectionTitle sub="Fuentes y tamaños de texto">🔤 Tipografía</SectionTitle>
        <style>{`@import url('${fontLink}');`}</style>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <div style={{ marginBottom: 14, gridColumn: "1/-1" }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#3a5a3a", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>Fuente del logo / títulos</label>
            <select value={local.fontDisplay} onChange={e => set("fontDisplay", e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #dde4dd", fontSize: 14, outline: "none", fontFamily: "inherit", background: "#fff" }}>
              {FONT_OPTIONS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
            </select>
            <div style={{ marginTop: 8, fontFamily: local.fontDisplay, fontSize: 22, color: "#1a2e1a" }}>✡ {local.storeName || "Kosher Market"}</div>
          </div>
          <div style={{ marginBottom: 14, gridColumn: "1/-1" }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#3a5a3a", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>Fuente del cuerpo / productos</label>
            <select value={local.fontBody} onChange={e => set("fontBody", e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #dde4dd", fontSize: 14, outline: "none", fontFamily: "inherit", background: "#fff" }}>
              {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <div style={{ marginTop: 8, fontFamily: local.fontBody, fontSize: 14, color: "#7a8a7a" }}>Pechuga de Pollo · $4.200 · Fresca, sin piel, supervisión Vaad Harabanim</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 12px" }}>
          <Field label="Tamaño base (px)" value={local.fontSizeBase} onChange={v => set("fontSizeBase", v)} type="number" min="12" max="18" />
          <Field label="Producto (px)" value={local.fontSizeProduct} onChange={v => set("fontSizeProduct", v)} type="number" min="11" max="16" />
          <Field label="Precio (px)" value={local.fontSizePrice} onChange={v => set("fontSizePrice", v)} type="number" min="13" max="22" />
        </div>
        <Field label="Espaciado letras logo" value={local.letterSpacingLogo} onChange={v => set("letterSpacingLogo", v)} placeholder="0.02em" hint='Ej: "0em", "0.05em", "0.1em"' />
      </div>

      {/* LAYOUT */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #eef0ee", marginBottom: 16 }}>
        <SectionTitle sub="Cómo se ven las tarjetas y la grilla">📐 Layout y tarjetas</SectionTitle>
        <Field label="Columnas de productos" value={local.productColumns} onChange={v => set("productColumns", v)} options={[{value:"auto",label:"Automático (recomendado)"},{value:"2",label:"2 columnas"},{value:"3",label:"3 columnas"},{value:"4",label:"4 columnas"}]} />
        <Field label="Radio de esquinas de tarjetas (px)" value={local.cardRadius} onChange={v => set("cardRadius", v)} type="number" min="0" max="32" />
        <Field label="Sombra de tarjetas" value={local.cardShadow} onChange={v => set("cardShadow", v)} options={["none","soft","medium","strong"]} />
        <Field label="Proporción de imagen" value={local.imageAspect} onChange={v => set("imageAspect", v)} options={[{value:"1/1",label:"Cuadrada (1:1)"},{value:"4/3",label:"Horizontal (4:3)"},{value:"3/4",label:"Vertical (3:4)"}]} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid #eef0ee" }}>
          <div><div style={{ fontSize: 13, fontWeight: 700 }}>Mostrar descripciones</div></div>
          <Toggle checked={local.showDescriptions} onChange={v => set("showDescriptions", v)} size={36} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid #eef0ee" }}>
          <div><div style={{ fontSize: 13, fontWeight: 700 }}>Mostrar unidades</div><div style={{ fontSize: 12, color: "#7a8a7a" }}>"por kg", "por unidad", etc.</div></div>
          <Toggle checked={local.showUnits} onChange={v => set("showUnits", v)} size={36} />
        </div>
      </div>

      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}

// --- STORE TAB ---
function StoreTab({ cfg, onSave }) {
  const [local, setLocal] = useState(cfg);
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setLocal(prev => ({ ...prev, [k]: v }));
  function handleSave() { onSave(local); setSaved(true); setTimeout(() => setSaved(false), 1500); }

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>

      {/* IDENTITY */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #eef0ee", marginBottom: 16 }}>
        <SectionTitle sub="Nombre, logo y slogan de tu tienda">🏪 Identidad</SectionTitle>
        <Field label="Nombre de la tienda" value={local.storeName} onChange={v => set("storeName", v)} placeholder="Kosher Market" />
        <Field label="Slogan" value={local.storeSlogan} onChange={v => set("storeSlogan", v)} placeholder="Kosher · Fresco · Confiable" />
        <Field label="Emoji del logo (si no tenés imagen)" value={local.logoEmoji} onChange={v => set("logoEmoji", v)} placeholder="✡" hint="Aparece antes del nombre en el header" />
        <Field label="URL del logo (imagen)" value={local.logoUrl} onChange={v => set("logoUrl", v)} placeholder="https://... (opcional, reemplaza el emoji)" />
        {local.logoUrl && <div style={{ marginBottom: 14, height: 60, display: "flex", alignItems: "center" }}><img src={local.logoUrl} style={{ maxHeight: 56, maxWidth: 180, objectFit: "contain", borderRadius: 8 }} onError={e => e.currentTarget.style.opacity = ".3"} /></div>}
      </div>

      {/* WHATSAPP */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #eef0ee", marginBottom: 16 }}>
        <SectionTitle sub="Número y mensaje que recibe el cliente al finalizar el pedido">💬 WhatsApp</SectionTitle>
        <Field label="Número de WhatsApp" value={local.whatsappNumber} onChange={v => set("whatsappNumber", v)} placeholder="5491169600924" hint='Sin espacios ni "+". Ej: 5491169600924 (Argentina)' />
        <Field label="Mensaje predeterminado del pedido" value={local.whatsappMessage} onChange={v => set("whatsappMessage", v)} multiline hint={<span>Variables disponibles: <code style={{ background: "#f0f4f0", padding: "1px 4px", borderRadius: 4, fontSize: 11 }}>{"{{storeName}}"}</code> <code style={{ background: "#f0f4f0", padding: "1px 4px", borderRadius: 4, fontSize: 11 }}>{"{{items}}"}</code> <code style={{ background: "#f0f4f0", padding: "1px 4px", borderRadius: 4, fontSize: 11 }}>{"{{total}}"}</code></span>} />
        <div style={{ background: "#f0f9f4", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#3a7a3a", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "monospace", marginTop: -8 }}>
          {local.whatsappMessage.replace("{{storeName}}", local.storeName).replace("{{items}}", "• 2x Pechuga de Pollo — $8.400\n• 1x Jalá Trenzada — $1.800").replace("{{total}}", "$10.200")}
        </div>
      </div>

      {/* BANNER */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #eef0ee", marginBottom: 16 }}>
        <SectionTitle sub="El banner promocional que aparece en la página de inicio">🎯 Banner principal</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Mostrar banner</div>
          <Toggle checked={local.bannerEnabled} onChange={v => set("bannerEnabled", v)} size={40} />
        </div>
        <Field label="Etiqueta pequeña superior" value={local.bannerTag} onChange={v => set("bannerTag", v)} placeholder="✡ Esta semana" />
        <Field label="Título del banner" value={local.bannerTitle} onChange={v => set("bannerTitle", v)} placeholder="Especiales de Shabat" hint="Podés usar Enter para forzar un salto de línea" />
        <Field label="Subtítulo" value={local.bannerSubtitle} onChange={v => set("bannerSubtitle", v)} placeholder="Jalot, vinos y carnes seleccionadas" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <Field label="Texto del botón" value={local.bannerBtnText} onChange={v => set("bannerBtnText", v)} placeholder="Ver productos →" />
          <Field label="Filtro al hacer clic" value={local.bannerBtnFilter} onChange={v => set("bannerBtnFilter", v)} options={["all","oferta","nuevo","shabat","recomendado"]} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }}>
          <ColorField label="Color fondo desde" value={local.bannerBgFrom} onChange={v => set("bannerBgFrom", v)} />
          <ColorField label="Color fondo hasta" value={local.bannerBgTo} onChange={v => set("bannerBgTo", v)} />
          <ColorField label="Color de textos" value={local.bannerTextColor} onChange={v => set("bannerTextColor", v)} />
        </div>
        <Field label="Imagen de fondo (URL, opcional)" value={local.bannerImageUrl} onChange={v => set("bannerImageUrl", v)} placeholder="https://... (opcional)" />
        {/* Preview */}
        <div style={{ background: `linear-gradient(135deg, ${local.bannerBgFrom}, ${local.bannerBgTo})`, borderRadius: 14, padding: "20px 22px", marginTop: 4, backgroundImage: local.bannerImageUrl ? `linear-gradient(135deg, ${local.bannerBgFrom}cc, ${local.bannerBgTo}cc), url(${local.bannerImageUrl})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div style={{ fontSize: 10, color: local.bannerTextColor, opacity: .8, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".12em" }}>{local.bannerTag}</div>
          <div style={{ fontSize: 20, color: local.bannerTextColor, fontWeight: 700, marginBottom: 4, whiteSpace: "pre-line" }}>{local.bannerTitle}</div>
          <div style={{ fontSize: 12, color: local.bannerTextColor, opacity: .75, marginBottom: 14 }}>{local.bannerSubtitle}</div>
          <div style={{ display: "inline-block", background: local.bannerTextColor, color: local.bannerBgFrom, borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13 }}>{local.bannerBtnText}</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #eef0ee", marginBottom: 16 }}>
        <SectionTitle sub="Texto al pie de la tienda">📄 Footer</SectionTitle>
        <Field label="Texto del footer" value={local.footerText} onChange={v => set("footerText", v)} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <ColorField label="Fondo footer" value={local.footerBg} onChange={v => set("footerBg", v)} />
          <ColorField label="Color texto footer" value={local.footerTextColor} onChange={v => set("footerTextColor", v)} />
        </div>
      </div>

      {/* ADMIN */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #eef0ee", marginBottom: 16 }}>
        <SectionTitle sub="Contraseña para acceder al panel de administración">🔐 Seguridad</SectionTitle>
        <Field label="Contraseña del panel admin" value={local.adminPassword} onChange={v => set("adminPassword", v)} type="password" hint="Mínimo 6 caracteres. Guardá esta contraseña en un lugar seguro." />
      </div>

      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN SHELL
// ─────────────────────────────────────────────────────────────────────────────
function AdminPanel({ products, categories, tags, cfg, onSaveProducts, onSaveCategories, onSaveTags, onSaveCfg, onClose }) {
  const [tab, setTab] = useState("products");
  const TABS = [
    { id: "products",   icon: "📦", label: "Productos" },
    { id: "categories", icon: "🗂",  label: "Categorías" },
    { id: "tags",       icon: "🏷",  label: "Etiquetas" },
    { id: "design",     icon: "🎨",  label: "Diseño" },
    { id: "store",      icon: "⚙️",  label: "Tienda" },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "#f5f7f5", zIndex: 950, display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#0f4c35", color: "#fff", padding: "13px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>Panel de Administración</div>
          <div style={{ fontSize: 11, color: "#7dc89a" }}>{cfg.storeName}</div>
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 9, padding: "8px 14px", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit" }}>← Ver tienda</button>
      </div>
      {/* Tab bar */}
      <div style={{ background: "#fff", borderBottom: "1.5px solid #eef0ee", display: "flex", overflowX: "auto", flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flexShrink: 0, padding: "13px 16px", border: "none", background: "none", borderBottom: `2.5px solid ${tab === t.id ? "#0f4c35" : "transparent"}`, color: tab === t.id ? "#0f4c35" : "#7a8a7a", fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "products"   && <ProductsTab   products={products}   categories={categories} tags={tags} onSave={onSaveProducts} />}
        {tab === "categories" && <CategoriesTab categories={categories} onSave={onSaveCategories} />}
        {tab === "tags"       && <TagsTab       tags={tags}           onSave={onSaveTags} />}
        {tab === "design"     && <DesignTab     cfg={cfg}             onSave={onSaveCfg} />}
        {tab === "store"      && <StoreTab      cfg={cfg}             onSave={onSaveCfg} />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STOREFRONT COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function ProductCard({ product, tags, cfg, onAdd, onOpen }) {
  const [pop, setPop] = useState(false);
  const shadow = SHADOW_MAP[cfg.cardShadow] || SHADOW_MAP.soft;
  const tagObjs = tags.filter(t => product.tags?.includes(t.id) && t.active);

  function handleAdd(e) {
    e.stopPropagation();
    setPop(true); onAdd(product, product.variants?.[0] || null, 1);
    setTimeout(() => setPop(false), 700);
  }
  return (
    <div onClick={() => onOpen(product)} style={{ background: cfg.colorCard, borderRadius: cfg.cardRadius + "px", overflow: "hidden", boxShadow: shadow, cursor: "pointer", border: `1px solid ${cfg.colorBorder}`, display: "flex", flexDirection: "column", transition: "box-shadow .2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = SHADOW_MAP.strong}
      onMouseLeave={e => e.currentTarget.style.boxShadow = shadow}>
      <div style={{ position: "relative", aspectRatio: cfg.imageAspect, overflow: "hidden", background: "#f3f5f2" }}>
        <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = ""} />
        {tagObjs.length > 0 && (
          <div style={{ position: "absolute", top: 7, left: 7, display: "flex", flexDirection: "column", gap: 3 }}>
            {tagObjs.slice(0, 2).map(t => <Badge key={t.id} tag={t} />)}
          </div>
        )}
      </div>
      <div style={{ padding: "11px 12px 10px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: cfg.fontSizeProduct + "px", fontWeight: 700, color: cfg.colorText, lineHeight: 1.3, marginBottom: 3, fontFamily: cfg.fontBody }}>{product.name}</div>
        {cfg.showDescriptions && <div style={{ fontSize: "11px", color: cfg.colorTextMuted, lineHeight: 1.4, flex: 1, fontFamily: cfg.fontBody }}>{product.description}</div>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
          <div>
            <div style={{ fontSize: cfg.fontSizePrice + "px", fontWeight: 800, color: cfg.colorPriceTag, fontFamily: cfg.fontBody }}>{fmt(product.price)}</div>
            {product.originalPrice && <div style={{ fontSize: 10, color: "#bbb", textDecoration: "line-through" }}>{fmt(product.originalPrice)}</div>}
            {cfg.showUnits && <div style={{ fontSize: 10, color: cfg.colorTextMuted }}>{product.unit}</div>}
          </div>
          <button onClick={handleAdd} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: pop ? cfg.colorAccent : cfg.colorPrimary, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .25s", flexShrink: 0 }}>
            {pop ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ product, tags, cfg, onClose, onAdd }) {
  const [sel, setSel] = useState(product.variants?.[0] || null);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  const price = variantPrice(product, sel);
  const tagObjs = tags.filter(t => product.tags?.includes(t.id) && t.active);
  function handle() { onAdd(product, sel, qty); setDone(true); setTimeout(() => { setDone(false); onClose(); }, 800); }
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,30,15,.6)", zIndex: 900, display: "flex", alignItems: "flex-end", backdropFilter: "blur(6px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: cfg.colorCard, borderRadius: "22px 22px 0 0", width: "100%", maxHeight: "92vh", overflowY: "auto", maxWidth: 480, margin: "0 auto", animation: "slideUp .28s ease" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "13px 0 0" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: cfg.colorBorder }} /></div>
        <div style={{ margin: "11px 15px", borderRadius: parseInt(cfg.cardRadius) + "px", overflow: "hidden", aspectRatio: cfg.imageAspect, background: "#f3f5f2" }}>
          <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ padding: "0 20px 40px" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 9 }}>{tagObjs.map(t => <Badge key={t.id} tag={t} />)}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: cfg.colorText, marginBottom: 4, fontFamily: cfg.fontBody }}>{product.name}</div>
          <div style={{ fontSize: 13, color: cfg.colorTextMuted, marginBottom: 18, lineHeight: 1.6, fontFamily: cfg.fontBody }}>{product.description}</div>
          {product.variants?.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: cfg.colorPrimary, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".08em" }}>Presentación</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {product.variants.map(v => (
                  <button key={v} onClick={() => setSel(v)} style={{ padding: "8px 14px", borderRadius: 10, border: `2px solid ${sel === v ? cfg.colorPrimary : cfg.colorBorder}`, background: sel === v ? cfg.colorPrimaryLight : "#fff", color: sel === v ? cfg.colorPrimary : cfg.colorTextMuted, fontWeight: sel === v ? 700 : 500, fontSize: 13, cursor: "pointer", transition: "all .15s", fontFamily: cfg.fontBody }}>{v}</button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${cfg.colorBorder}`, background: "#fff", fontSize: 18, cursor: "pointer", color: cfg.colorText, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
              <span style={{ fontSize: 20, fontWeight: 700, color: cfg.colorText, minWidth: 24, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: cfg.colorPrimary, fontSize: 18, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: cfg.colorPriceTag }}>{fmt(price * qty)}</div>
              {cfg.showUnits && <div style={{ fontSize: 11, color: cfg.colorTextMuted }}>{product.unit}</div>}
            </div>
          </div>
          <button onClick={handle} style={{ width: "100%", padding: 15, borderRadius: parseInt(cfg.cardRadius) + "px", border: "none", background: done ? cfg.colorAccent : cfg.colorPrimary, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "background .3s", fontFamily: cfg.fontBody }}>
            {done ? "✓ Agregado al carrito" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ items, cfg, onClose, onUpdateQty, onRemove }) {
  const total = items.reduce((s, i) => s + variantPrice(i.product, i.variant) * i.qty, 0);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,30,15,.55)", zIndex: 900, backdropFilter: "blur(6px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(100%,400px)", background: cfg.colorCard, display: "flex", flexDirection: "column", animation: "slideRight .28s ease" }}>
        <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${cfg.colorBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: cfg.colorText }}>🛒 Mi pedido</div>
          <button onClick={onClose} style={{ background: cfg.colorBg, border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: cfg.colorTextMuted }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: cfg.colorTextMuted }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🛒</div>
              <div style={{ fontSize: 15, fontFamily: cfg.fontBody }}>Tu carrito está vacío</div>
            </div>
          ) : items.map(item => {
            const p = variantPrice(item.product, item.variant);
            return (
              <div key={item.id} style={{ display: "flex", gap: 12, marginBottom: 15, paddingBottom: 15, borderBottom: `1px solid ${cfg.colorBorder}` }}>
                <img src={item.product.image} style={{ width: 52, height: 52, objectFit: "cover", borderRadius: parseInt(cfg.cardRadius) * .6 + "px", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: cfg.colorText, marginBottom: 2, fontFamily: cfg.fontBody }}>{item.product.name}</div>
                  {item.variant && <div style={{ fontSize: 11, color: cfg.colorTextMuted, marginBottom: 4 }}>{item.variant.split("—")[0].trim()}</div>}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => item.qty === 1 ? onRemove(item.id) : onUpdateQty(item.id, item.qty - 1)} style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${cfg.colorBorder}`, background: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.qty === 1 ? "🗑" : "−"}</button>
                      <span style={{ fontSize: 14, fontWeight: 700, color: cfg.colorText }}>{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.id, item.qty + 1)} style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: cfg.colorPrimary, color: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: cfg.colorPriceTag }}>{fmt(p * item.qty)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {items.length > 0 && (
          <div style={{ padding: "14px 20px 36px", borderTop: `1px solid ${cfg.colorBorder}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: cfg.colorTextMuted }}>Total estimado</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: cfg.colorPriceTag }}>{fmt(total)}</span>
            </div>
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 16 }}>* Algunos precios varían por peso exacto</div>
            <a href={buildWAMsg(items, cfg)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button style={{ width: "100%", padding: 15, borderRadius: parseInt(cfg.cardRadius) + "px", border: "none", background: cfg.colorWhatsapp, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: cfg.fontBody }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Finalizar por WhatsApp
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [products,   setProducts]   = useState(() => load("km_products",   DEFAULT_PRODUCTS));
  const [categories, setCategories] = useState(() => load("km_categories", DEFAULT_CATEGORIES));
  const [tags,       setTags]       = useState(() => load("km_tags",       DEFAULT_TAGS));
  const [cfg,        setCfg]        = useState(() => load("km_cfg",        DEFAULT_CONFIG));
  const [cart,       setCart]       = useState(() => load("km_cart",       []));

  const [activeCat,    setActiveCat]    = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [search,       setSearch]       = useState("");
  const [showCart,     setShowCart]     = useState(false);
  const [selProduct,   setSelProduct]   = useState(null);
  const [showAdmin,    setShowAdmin]    = useState(false);
  const [adminAuth,    setAdminAuth]    = useState(false);
  const [adminPass,    setAdminPass]    = useState("");
  const [passErr,      setPassErr]      = useState(false);

  useEffect(() => { save("km_cart", cart); }, [cart]);

  const saveProducts   = p  => { setProducts(p);   save("km_products",   p); };
  const saveCategories = c  => { setCategories(c); save("km_categories", c); };
  const saveTags       = t  => { setTags(t);       save("km_tags",       t); };
  const saveCfg        = c  => { setCfg(c);        save("km_cfg",        c); };

  function addToCart(product, variant, qty) {
    const id = `${product.id}_${variant || "base"}`;
    setCart(prev => {
      const ex = prev.find(i => i.id === id);
      if (ex) return prev.map(i => i.id === id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { id, product, variant, qty }];
    });
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + variantPrice(i.product, i.variant) * i.qty, 0);

  const filtered = useMemo(() => {
    let p = products.filter(x => x.active);
    if (activeCat !== "all") p = p.filter(x => x.category === activeCat);
    if (activeFilter !== "all") p = p.filter(x => x.tags?.includes(activeFilter));
    if (search) { const q = search.toLowerCase(); p = p.filter(x => x.name.toLowerCase().includes(q) || x.description?.toLowerCase().includes(q)); }
    return p;
  }, [products, activeCat, activeFilter, search]);

  function tryLogin() {
    if (adminPass === cfg.adminPassword) { setAdminAuth(true); setShowAdmin(true); setPassErr(false); setAdminPass(""); }
    else setPassErr(true);
  }

  // Dynamic font import
  const fontLink = `https://fonts.googleapis.com/css2?family=${cfg.fontDisplay.replace(/ /g,"+")}:wght@600;700&family=${cfg.fontBody.replace(/ /g,"+")}:ital,wght@0,400;0,500;0,700;0,800;1,400&display=swap`;

  const colCfg = cfg.productColumns === "auto"
    ? "repeat(2,1fr)"
    : `repeat(${cfg.productColumns},1fr)`;

  return (
    <>
      <style>{`
        @import url('${fontLink}');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${cfg.colorBg}; font-family: '${cfg.fontBody}', sans-serif; font-size: ${cfg.fontSizeBase}px; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-thumb { background: ${cfg.colorBorder}; border-radius: 2px; }
        .hide-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        @keyframes slideUp   { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideRight{ from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn    { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn     { from { transform: scale(.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .pgrid { display: grid; grid-template-columns: ${colCfg}; gap: 10px; }
        @media(min-width:480px){ .pgrid { gap: 12px; ${cfg.productColumns === "auto" ? "grid-template-columns: repeat(3,1fr);" : ""} } }
        @media(min-width:680px){ .pgrid { gap: 14px; ${cfg.productColumns === "auto" ? "grid-template-columns: repeat(4,1fr);" : ""} } }
        input::placeholder, textarea::placeholder { color: #aab5aa; }
        input:focus, textarea:focus, select:focus { border-color: ${cfg.colorPrimary} !important; box-shadow: 0 0 0 3px ${cfg.colorPrimary}22; }
        code { font-family: monospace; }
      `}</style>

      {/* ── ADMIN LOGIN ── */}
      {showAdmin && !adminAuth && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,25,10,.75)", zIndex: 980, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "30px 26px", width: "min(340px,92vw)", animation: "popIn .25s ease" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: cfg.colorText, marginBottom: 3 }}>🔐 Panel Admin</div>
            <div style={{ fontSize: 13, color: cfg.colorTextMuted, marginBottom: 22 }}>{cfg.storeName}</div>
            <input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} onKeyDown={e => e.key === "Enter" && tryLogin()} placeholder="Contraseña" autoFocus style={{ width: "100%", padding: "12px 14px", borderRadius: 11, border: `1.5px solid ${passErr ? "#ef4444" : cfg.colorBorder}`, fontSize: 15, outline: "none", marginBottom: 8, fontFamily: "inherit" }} />
            {passErr && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 8 }}>Contraseña incorrecta</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setShowAdmin(false); setAdminPass(""); setPassErr(false); }} style={{ flex: 1, padding: 12, borderRadius: 11, border: `1.5px solid ${cfg.colorBorder}`, background: "#fff", color: cfg.colorTextMuted, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
              <button onClick={tryLogin} style={{ flex: 1, padding: 12, borderRadius: 11, border: "none", background: cfg.colorPrimary, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Entrar</button>
            </div>
            <div style={{ fontSize: 11, color: "#ccc", marginTop: 14, textAlign: "center" }}>Contraseña por defecto: admin123</div>
          </div>
        </div>
      )}

      {/* ── ADMIN PANEL ── */}
      {showAdmin && adminAuth && (
        <AdminPanel
          products={products} categories={categories} tags={tags} cfg={cfg}
          onSaveProducts={saveProducts} onSaveCategories={saveCategories}
          onSaveTags={saveTags} onSaveCfg={saveCfg}
          onClose={() => { setShowAdmin(false); setAdminAuth(false); }}
        />
      )}

      {/* ── STORE ── */}
      <div style={{ minHeight: "100vh", background: cfg.colorBg, paddingBottom: 100 }}>

        {/* HEADER */}
        <div style={{ background: cfg.colorHeader, position: "sticky", top: 0, zIndex: 100, boxShadow: `0 2px 16px ${cfg.colorPrimary}44` }}>
          <div style={{ maxWidth: 720, margin: "0 auto", padding: "13px 16px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {cfg.logoUrl
                  ? <img src={cfg.logoUrl} style={{ height: 40, maxWidth: 140, objectFit: "contain" }} onError={e => e.currentTarget.style.display = "none"} />
                  : <div>
                      <div style={{ fontFamily: `'${cfg.fontDisplay}', serif`, fontSize: 22, fontWeight: 700, color: cfg.colorHeaderText, letterSpacing: cfg.letterSpacingLogo, lineHeight: 1 }}>
                        {cfg.logoEmoji} {cfg.storeName}
                      </div>
                      <div style={{ fontSize: 10, color: cfg.colorHeaderText, opacity: .6, letterSpacing: ".14em", textTransform: "uppercase", marginTop: 2 }}>{cfg.storeSlogan}</div>
                    </div>
                }
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => setShowAdmin(true)} style={{ background: "rgba(255,255,255,.12)", border: "none", borderRadius: 9, padding: "8px 10px", color: cfg.colorHeaderText, cursor: "pointer", fontSize: 15, opacity: .7 }} title="Admin">⚙️</button>
                <button onClick={() => setShowCart(true)} style={{ position: "relative", background: cfg.colorPrimaryLight, border: "none", borderRadius: 11, padding: "9px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: cfg.colorPrimary, fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>
                  🛒
                  {cartCount > 0 && <>
                    <span>{fmt(cartTotal)}</span>
                    <span style={{ position: "absolute", top: -6, right: -6, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 19, height: 19, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
                  </>}
                </button>
              </div>
            </div>

            <div style={{ position: "relative", marginBottom: 10 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: cfg.colorHeaderText, opacity: .4 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar productos..." style={{ width: "100%", padding: "10px 12px 10px 34px", borderRadius: 11, border: "none", background: "rgba(255,255,255,.12)", color: cfg.colorHeaderText, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            </div>

            <div className="hide-scroll" style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
              {[{ id: "all", name: "Todo", icon: "✦" }, ...categories.filter(c => c.active)].map(cat => (
                <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{ flexShrink: 0, padding: "6px 13px", borderRadius: 20, border: `1.5px solid ${activeCat === cat.id ? cfg.colorHeaderText : "rgba(255,255,255,.18)"}`, background: activeCat === cat.id ? cfg.colorHeaderText : "transparent", color: activeCat === cat.id ? cfg.colorPrimary : cfg.colorHeaderText, fontWeight: activeCat === cat.id ? 700 : 500, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s", fontFamily: "inherit", opacity: activeCat === cat.id ? 1 : .75 }}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FILTER PILLS */}
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "12px 16px 0" }}>
          <div className="hide-scroll" style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            {[{ id: "all", label: "Todos" }, ...tags.filter(t => t.active).map(t => ({ id: t.id, label: t.label }))].map(f => (
              <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 20, fontSize: 12, border: `1.5px solid ${activeFilter === f.id ? cfg.colorPrimary : cfg.colorBorder}`, background: activeFilter === f.id ? cfg.colorPrimary : cfg.colorCard, color: activeFilter === f.id ? "#fff" : cfg.colorTextMuted, fontWeight: activeFilter === f.id ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", transition: "all .15s" }}>{f.label}</button>
            ))}
          </div>
        </div>

        {/* BANNER */}
        {cfg.bannerEnabled && activeCat === "all" && !search && activeFilter === "all" && (
          <div style={{ maxWidth: 720, margin: "14px auto 0", padding: "0 16px" }}>
            <div style={{ background: `linear-gradient(135deg, ${cfg.bannerBgFrom}, ${cfg.bannerBgTo})`, backgroundImage: cfg.bannerImageUrl ? `linear-gradient(135deg,${cfg.bannerBgFrom}cc,${cfg.bannerBgTo}cc),url(${cfg.bannerImageUrl})` : undefined, backgroundSize: "cover", backgroundPosition: "center", borderRadius: parseInt(cfg.cardRadius) * 1.2 + "px", padding: "22px 24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, background: `radial-gradient(circle,${cfg.bannerTextColor}18 0%,transparent 70%)`, borderRadius: "50%" }} />
              <div style={{ fontSize: 10, color: cfg.bannerTextColor, opacity: .8, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 6 }}>{cfg.bannerTag}</div>
              <div style={{ fontFamily: `'${cfg.fontDisplay}', serif`, fontSize: 26, color: cfg.bannerTextColor, fontWeight: 700, marginBottom: 6, lineHeight: 1.15, whiteSpace: "pre-line" }}>{cfg.bannerTitle}</div>
              <div style={{ fontSize: 13, color: cfg.bannerTextColor, opacity: .8, marginBottom: 18 }}>{cfg.bannerSubtitle}</div>
              <button onClick={() => setActiveFilter(cfg.bannerBtnFilter)} style={{ background: cfg.bannerTextColor, color: cfg.bannerBgFrom, border: "none", borderRadius: parseInt(cfg.cardRadius) * .7 + "px", padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>{cfg.bannerBtnText}</button>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        <div style={{ maxWidth: 720, margin: "16px auto 0", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: cfg.colorText }}>
              {search ? `"${search}"` : activeCat === "all" ? "Todos los productos" : categories.find(c => c.id === activeCat)?.name || ""}
            </div>
            <div style={{ fontSize: 13, color: cfg.colorTextMuted }}>{filtered.length} productos</div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: cfg.colorTextMuted, animation: "fadeIn .3s ease" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🔍</div>
              <div style={{ fontSize: 15, marginBottom: 16 }}>No encontramos productos</div>
              <button onClick={() => { setSearch(""); setActiveCat("all"); setActiveFilter("all"); }} style={{ padding: "9px 20px", borderRadius: 20, border: `1.5px solid ${cfg.colorPrimary}`, background: "transparent", color: cfg.colorPrimary, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Ver todo</button>
            </div>
          ) : (
            <div className="pgrid" style={{ animation: "fadeIn .3s ease" }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} tags={tags} cfg={cfg} onAdd={addToCart} onOpen={setSelProduct} />)}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div style={{ background: cfg.footerBg, marginTop: 48, padding: "18px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: cfg.footerTextColor }}>{cfg.footerText}</div>
        </div>
      </div>

      {/* FLOATING CART */}
      {cartCount > 0 && !showCart && !selProduct && !showAdmin && (
        <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 500, animation: "slideUp .3s ease" }}>
          <button onClick={() => setShowCart(true)} style={{ background: cfg.colorCartBtn, color: "#fff", border: "none", borderRadius: 30, padding: "13px 26px", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: `0 8px 28px ${cfg.colorPrimary}44`, display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit", whiteSpace: "nowrap" }}>
            <span style={{ background: cfg.colorPrimaryLight, color: cfg.colorPrimary, borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{cartCount}</span>
            Ver pedido · {fmt(cartTotal)}
          </button>
        </div>
      )}

      {selProduct && <ProductModal product={selProduct} tags={tags} cfg={cfg} onClose={() => setSelProduct(null)} onAdd={addToCart} />}
      {showCart && <CartDrawer items={cart} cfg={cfg} onClose={() => setShowCart(false)} onUpdateQty={(id, qty) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))} onRemove={id => setCart(prev => prev.filter(i => i.id !== id))} />}
    </>
  );
}

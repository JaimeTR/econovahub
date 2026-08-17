'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { LandingPage, Product } from '@/lib/types';
import { useNotification } from '@/components/ui/NotificationProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const THEMES = [
  { id: 'rose', label: 'Rosa', primary: '#e8a0bf' },
  { id: 'blue', label: 'Azul', primary: '#3b82f6' },
  { id: 'green', label: 'Verde', primary: '#10b981' },
  { id: 'purple', label: 'Purpura', primary: '#8b5cf6' },
  { id: 'orange', label: 'Naranja', primary: '#f59e0b' },
];

const SECTIONS = [
  { id: 'hero', label: 'Hero', fields: [
    { key: 'title', label: 'Titulo principal', type: 'text' },
    { key: 'subtitle', label: 'Subtitulo', type: 'textarea' },
    { key: 'buttons', label: 'Botones', type: 'buttons' },
  ]},
  { id: 'problems', label: 'Problema / Solucion', fields: [
    { key: 'title', label: 'Titulo de la seccion', type: 'text' },
    { key: 'problem', label: 'Texto del problema', type: 'textarea' },
    { key: 'solution', label: 'Texto de la solucion', type: 'textarea' },
  ]},
  { id: 'creator', label: 'Creadora', fields: [
    { key: 'note', label: 'Nota', type: 'note', value: 'La foto, nombre y biografia se editan desde el perfil del admin.' },
  ]},
  { id: 'plans', label: 'Planes', fields: [
    { key: 'note', label: 'Nota', type: 'note', value: 'Crea y edita productos desde Productos. Selecciona abajo cuales mostrar en esta landing.' },
  ]},
  { id: 'how', label: 'Como funciona', fields: [
    { key: 'subtitle', label: 'Subtitulo', type: 'text' },
    { key: 'note', label: 'Nota', type: 'note', value: 'Los 3 pasos (Elegir plan → Pagar → Descargar) son fijos.' },
  ]},
  { id: 'faq', label: 'FAQ', fields: [
    { key: 'note', label: 'Nota', type: 'note', value: 'Las preguntas frecuentes se editan desde el codigo por ahora.' },
  ]},
  { id: 'cta', label: 'CTA final', fields: [
    { key: 'title', label: 'Titulo', type: 'text' },
    { key: 'subtitle', label: 'Subtitulo', type: 'textarea' },
    { key: 'button', label: 'Texto del boton', type: 'text' },
  ]},
];

const DEFAULT = {
  hero: { title: 'Organiza tus ventas por catálogo', subtitle: 'Plantillas de Excel profesionales para controlar clientes, productos, ventas y ganancias.', buttons: [{ text: 'Ver planes', url: '#planes' }] },
  problems: { title: '¿Por qué usar un sistema de gestión de ventas?', problem: 'Sin un registro ordenado pierdes clientes, no sabes si un producto deja ganancia.', solution: 'Ingresa tus datos y las hojas calculan automáticamente precios, ganancias y comisiones.' },
  how: { subtitle: 'Obtén tu plantilla en 3 pasos' },
  cta: { title: 'Empieza a organizar tu negocio hoy', subtitle: 'Invierte en el control de tu negocio. Descarga tu plantilla al instante.', button: 'Ver planes disponibles' },
  theme: { id: 'rose', primary: '#e8a0bf', variant: 'rose' },
  sections: Object.fromEntries(SECTIONS.map(s => [s.id, true])),
};

export default function AdminLanding() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const { notify, confirm } = useNotification();

  const [pages, setPages] = useState<LandingPage[]>([]);
  const [currentPage, setCurrentPage] = useState<LandingPage | null>(null);
  const [config, setConfig] = useState<any>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '' });

  useEffect(() => {
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pagesData, productsData] = await Promise.all([
        api.getLandingPages(token!),
        api.getMyProducts(token!),
      ]);
      setPages(pagesData);
      setProducts(productsData);
      // Select first page or create default
      if (pagesData.length > 0) {
        selectPage(pagesData[0].id);
      }
    } catch {
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const selectPage = async (id: string) => {
    try {
      const page = await api.getLandingPage(token!, id);
      setCurrentPage(page);
      const merged = { ...DEFAULT, ...page.config };
      setConfig(merged);
      setSelectedProducts(page.product_ids || []);
      setOpenSection(null);
    } catch {}
  };

  const update = (section: string, key: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const toggleSection = (sectionId: string) => {
    setConfig((prev: any) => ({
      ...prev,
      sections: { ...prev.sections, [sectionId]: !(prev.sections?.[sectionId] ?? true) },
    }));
  };

  const saveCurrentPage = async () => {
    if (!token || !currentPage) return;
    setSaving(true);
    const { sections, theme, ...content } = config;
    try {
      await api.updateLandingPage(token, currentPage.id, {
        config: { ...content, theme, sections },
        product_ids: selectedProducts,
      });
      await selectPage(currentPage.id);
      notify('success', 'Landing page guardada');
    } catch {
      notify('error', 'Error al guardar landing page');
    }
    setSaving(false);
  };

  const createPage = async () => {
    if (!token || !newPage.title || !newPage.slug) return;
    try {
      await api.createLandingPage(token, {
        title: newPage.title,
        slug: newPage.slug,
        config: DEFAULT,
        product_ids: [],
      });
      setNewPage({ title: '', slug: '' });
      setShowNewPageForm(false);
      loadData();
    } catch (e: any) {
      notify('error', e.message || 'Error al crear landing page');
    }
  };

  const deletePage = async (id: string) => {
    if (!token) return; if (!(await confirm('Eliminar esta landing page?'))) return;
    try {
      await api.deleteLandingPage(token, id);
      if (currentPage?.id === id) {
        setCurrentPage(null);
        setConfig(DEFAULT);
        setSelectedProducts([]);
      }
      loadData();
    } catch {}
  };

  const togglePublish = async (page: LandingPage) => {
    if (!token) return;
    try {
      await api.updateLandingPage(token, page.id, { published: !page.published });
      loadData();
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-light flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-elegant border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-light">
      <header className="bg-white border-b border-rose-soft/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-elegant flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-semibold text-text-dark">Econova Hub Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-sm text-text-gray hover:text-rose-elegant transition-colors">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 transition-colors">
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs de landing pages */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-dark">Landing Pages</h1>
          <button onClick={() => setShowNewPageForm(!showNewPageForm)}
            className="px-4 py-2 rounded-xl bg-rose-elegant text-white font-semibold text-sm hover:bg-rose-elegant/90 transition-all">
            {showNewPageForm ? 'Cancelar' : '+ Nueva Landing'}
          </button>
        </div>

        {/* Formulario nueva landing */}
        {showNewPageForm && (
          <div className="bg-white rounded-2xl border border-rose-soft/50 p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-text-dark mb-4">Nueva Landing Page</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-dark mb-1">Titulo</label>
                <input value={newPage.title} onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  placeholder="Ej: Plantillas Excel"
                  className="w-full px-3 py-2 rounded-xl border border-rose-soft/60 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-dark mb-1">Slug (URL)</label>
                <input value={newPage.slug} onChange={(e) => setNewPage({ ...newPage, slug: e.target.value.replace(/[^a-z0-9-]/g, '') })}
                  placeholder="plantillas-excel"
                  className="w-full px-3 py-2 rounded-xl border border-rose-soft/60 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/20" />
                <p className="text-[10px] text-text-gray mt-1">ej. econovahub.com/plantillas-excel</p>
              </div>
              <div className="flex items-end">
                <button onClick={createPage} className="px-5 py-2 rounded-xl bg-rose-elegant text-white font-semibold text-sm hover:bg-rose-elegant/90 transition-all w-full">
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de landing pages */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {pages.map((page) => (
            <div key={page.id} className="flex-shrink-0">
              <button onClick={() => selectPage(page.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${
                  currentPage?.id === page.id
                    ? 'bg-rose-elegant text-white border-rose-elegant'
                    : 'bg-white text-text-dark border-rose-soft/50 hover:border-rose-elegant/50'
                }`}>
                {page.title}
                {page.slug === 'main' && <span className="ml-1.5 text-[10px] opacity-70">(raiz /)</span>}
              </button>
              <div className="flex items-center justify-center gap-2 mt-1.5">
                {page.slug !== 'main' && (
                  <button onClick={() => deletePage(page.id)} className="text-[10px] text-red-400 hover:text-red-600">
                    Eliminar
                  </button>
                )}
                <button onClick={() => togglePublish(page)}
                  className={`text-[10px] ${page.published ? 'text-green-500' : 'text-text-gray'}`}>
                  {page.published ? 'Publicado' : 'Borrador'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {currentPage && (
          <div className="space-y-6">
            {/* Vista publica link */}
            <div className="bg-white rounded-2xl border border-rose-soft/50 p-4 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-text-gray">URL publica:</span>
                <a href={`${window.location.origin}/${currentPage.slug === 'main' ? '' : currentPage.slug}`}
                  target="_blank"
                  className="ml-2 text-sm text-rose-elegant font-medium hover:underline">
                  {window.location.origin}/{currentPage.slug === 'main' ? '' : currentPage.slug}
                </a>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${currentPage.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {currentPage.published ? 'Publicado' : 'Borrador'}
              </span>
            </div>

            {/* Theme */}
            <div className="bg-white rounded-2xl border border-rose-soft/50 p-6 shadow-sm">
              <h3 className="font-semibold text-text-dark mb-4">Tema visual</h3>
              <div className="flex flex-wrap gap-3">
                {THEMES.map((theme) => (
                  <button key={theme.id} onClick={() => setConfig((prev: any) => ({ ...prev, theme: { ...theme, variant: theme.id } }))}
                    className={`w-10 h-10 rounded-xl border-2 transition-all ${config.theme?.id === theme.id ? 'border-text-dark scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: theme.primary }} title={theme.label} />
                ))}
              </div>
            </div>

            {/* Secciones */}
            <div className="bg-white rounded-2xl border border-rose-soft/50 p-6 shadow-sm">
              <h3 className="font-semibold text-text-dark mb-4">Secciones</h3>
              {SECTIONS.map((s) => {
                const isOpen = openSection === s.id;
                const enabled = config.sections?.[s.id] ?? true;
                return (
                  <div key={s.id} className="border border-rose-soft/30 rounded-xl mb-3 overflow-hidden">
                    <button onClick={() => setOpenSection(isOpen ? null : s.id)}
                      className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 text-left hover:bg-rose-soft/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${enabled ? 'text-text-dark' : 'text-text-gray line-through'}`}>{s.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div onClick={(e) => { e.stopPropagation(); toggleSection(s.id); }}
                          className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${enabled ? 'bg-rose-elegant' : 'bg-gray-300'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                        </div>
                        <svg className={`w-4 h-4 text-text-gray transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {isOpen && enabled && s.fields && s.fields.length > 0 && (
                      <div className="px-4 sm:px-5 pb-4 border-t border-rose-soft/20 pt-3 space-y-3">
                        {s.fields.map((f: any) => (
                          <div key={f.key}>
                            <label className="text-xs text-text-gray block mb-1">{f.label}</label>
                            {f.type === 'note' ? (
                              <div>
                                <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 leading-relaxed">{f.value}</p>
                                {s.id === 'plans' && (
                                  <Link href="/admin/productos" className="inline-flex items-center gap-1 mt-2 text-xs text-rose-elegant font-medium hover:underline">
                                    Ir a Productos →
                                  </Link>
                                )}
                                {s.id === 'creator' && (
                                  <Link href="/admin/perfil" className="inline-flex items-center gap-1 mt-2 text-xs text-rose-elegant font-medium hover:underline">
                                    Ir a Perfil →
                                  </Link>
                                )}
                              </div>
                            ) : f.type === 'buttons' ? (
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-text-gray">Botones:</span>
                                  {[1, 2].map(n => (
                                    <button key={n} type="button" onClick={() => {
                                      const btns = config.hero?.buttons || [];
                                      const updated = Array.from({ length: n }, (_, i) => btns[i] || { text: '', url: '' });
                                      setConfig((prev: any) => ({ ...prev, hero: { ...prev.hero, buttons: updated } }));
                                    }}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${(config.hero?.buttons || []).length === n ? 'bg-rose-elegant text-white border-rose-elegant' : 'border-rose-soft/50 text-text-gray hover:border-rose-elegant/50'}`}>
                                      {n} botón{n > 1 ? 'es' : ''}
                                    </button>
                                  ))}
                                </div>
                                {(config.hero?.buttons || []).map((btn: any, i: number) => (
                                  <div key={i} className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-rose-soft/10 border border-rose-soft/30">
                                    <div className="col-span-2">
                                      <label className="text-[10px] text-text-gray">Texto del botón {i + 1}</label>
                                      <input value={btn.text || ''} onChange={e => {
                                        const btns = [...(config.hero?.buttons || [])];
                                        btns[i] = { ...btns[i], text: e.target.value };
                                        setConfig((prev: any) => ({ ...prev, hero: { ...prev.hero, buttons: btns } }));
                                      }} placeholder="Ej: Ver planes" className="w-full px-3 py-2 rounded-xl border border-rose-soft/60 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/20" />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="text-[10px] text-text-gray">Link del botón {i + 1}</label>
                                      <input value={btn.url || ''} onChange={e => {
                                        const btns = [...(config.hero?.buttons || [])];
                                        btns[i] = { ...btns[i], url: e.target.value };
                                        setConfig((prev: any) => ({ ...prev, hero: { ...prev.hero, buttons: btns } }));
                                      }} placeholder="Ej: #planes o https://..." className="w-full px-3 py-2 rounded-xl border border-rose-soft/60 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/20" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : f.type === 'textarea' ? (
                              <textarea value={config[s.id]?.[f.key] || ''} onChange={e => update(s.id, f.key, e.target.value)} rows={3}
                                className="w-full px-3 py-2 rounded-xl border border-rose-soft/60 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/20 focus:border-rose-elegant" />
                            ) : (
                              <input value={config[s.id]?.[f.key] || ''} onChange={e => update(s.id, f.key, e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-rose-soft/60 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/20 focus:border-rose-elegant" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Seleccion de productos por categoria - con orden */}
            <div className="bg-white rounded-2xl border border-rose-soft/50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-dark">Productos en esta landing</h3>
                <Link href="/admin/productos" className="text-xs text-rose-elegant font-medium hover:underline">
                  Editar en Productos →
                </Link>
              </div>
              <p className="text-xs text-text-gray mb-4">Agrega productos, luego ordenalos con las flechas. Se mostraran en ese orden en la seccion Planes.</p>

              {/* Productos seleccionados (ordenados) */}
              {selectedProducts.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-text-dark uppercase tracking-wider mb-2">
                    Seleccionados ({selectedProducts.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedProducts.map((pid, idx) => {
                      const p = products.find((pp) => pp.id === pid);
                      if (!p) return null;
                      return (
                        <div key={pid} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-rose-soft/20 border border-rose-soft/40">
                          <span className="text-xs font-bold text-text-gray w-5 text-center">{idx + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-dark truncate">{p.name}</p>
                            <p className="text-xs text-text-gray truncate">{p.tagline}</p>
                          </div>
                          <span className="text-xs font-medium text-rose-elegant flex-shrink-0">S/ {p.price}</span>
                          <div className="flex gap-1">
                            <button onClick={() => {
                              const arr = [...selectedProducts];
                              if (idx > 0) { [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]; setSelectedProducts(arr); }
                            }} disabled={idx === 0}
                              className="p-1.5 rounded-lg hover:bg-rose-soft/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                              <svg className="w-4 h-4 text-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            </button>
                            <button onClick={() => {
                              const arr = [...selectedProducts];
                              if (idx < arr.length - 1) { [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]; setSelectedProducts(arr); }
                            }} disabled={idx === selectedProducts.length - 1}
                              className="p-1.5 rounded-lg hover:bg-rose-soft/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                              <svg className="w-4 h-4 text-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <button onClick={() => setSelectedProducts((prev) => prev.filter((id) => id !== pid))}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Catalogo de productos disponibles por categoria */}
              <div>
                <h4 className="text-xs font-semibold text-text-dark uppercase tracking-wider mb-2">
                  Catalogo de productos
                </h4>
                {categories.length > 0 ? (
                  categories.map((cat) => {
                    const catProducts = products.filter((p) => p.category === cat && !selectedProducts.includes(p.id));
                    if (catProducts.length === 0) return null;
                    return (
                      <div key={cat} className="mb-3">
                        <h5 className="text-[10px] font-medium text-text-gray uppercase tracking-wider mb-1.5">{cat}</h5>
                        <div className="space-y-1.5">
                          {catProducts.map((p) => (
                            <button key={p.id} onClick={() => setSelectedProducts((prev) => [...prev, p.id])}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-dashed border-rose-soft/40 hover:border-rose-elegant/40 hover:bg-rose-soft/10 transition-all text-left">
                              <span className="text-lg">+</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-dark truncate">{p.name}</p>
                                <p className="text-xs text-text-gray truncate">{p.tagline}</p>
                              </div>
                              <span className="text-xs font-medium text-rose-elegant flex-shrink-0">S/ {p.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-text-gray">Crea productos con categorias para organizarlos.</p>
                )}

                {/* Productos sin categoria */}
                {products.filter((p) => !p.category && !selectedProducts.includes(p.id)).length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-[10px] font-medium text-text-gray uppercase tracking-wider mb-1.5">Sin categoria</h5>
                    <div className="space-y-1.5">
                      {products.filter((p) => !p.category && !selectedProducts.includes(p.id)).map((p) => (
                        <button key={p.id} onClick={() => setSelectedProducts((prev) => [...prev, p.id])}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-dashed border-rose-soft/40 hover:border-rose-elegant/40 hover:bg-rose-soft/10 transition-all text-left">
                          <span className="text-lg">+</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-dark truncate">{p.name}</p>
                            <p className="text-xs text-text-gray truncate">{p.tagline}</p>
                          </div>
                          <span className="text-xs font-medium text-rose-elegant flex-shrink-0">S/ {p.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones guardar */}
            <div className="sticky bottom-20 md:bottom-4 bg-white rounded-2xl border border-rose-soft/50 p-4 shadow-lg flex items-center justify-between">
              <div className="text-xs text-text-gray">
                <span className="font-medium text-text-dark">{SECTIONS.filter(s => config.sections?.[s.id] ?? true).length}</span> secciones activas
                · <span className="font-medium text-text-dark">{selectedProducts.length}</span> productos seleccionados
              </div>
              <div className="flex gap-2">
                {currentPage.slug !== 'main' && (
                  <button onClick={() => {
                    const previewUrl = `${window.location.origin}/${currentPage.slug === 'main' ? '' : currentPage.slug}`;
                    window.open(previewUrl, '_blank');
                  }}
                    className="px-4 py-2.5 rounded-xl border border-rose-soft/50 text-text-dark text-sm font-medium hover:bg-rose-soft/30 transition-all">
                    Vista previa
                  </button>
                )}
                <button onClick={saveCurrentPage} disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-rose-elegant text-white font-semibold text-sm hover:bg-rose-elegant/90 transition-all disabled:opacity-50">
                  {saving ? 'Guardando...' : 'Publicar cambios'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
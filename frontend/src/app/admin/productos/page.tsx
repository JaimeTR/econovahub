'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Product, ProductFile } from '@/lib/types';
import { useNotification } from '@/components/ui/NotificationProvider';

import { getBackendUrl } from '@/lib/urls';

const BACKEND_URL = getBackendUrl();

const FILE_TYPE_LABELS: Record<string, string> = {
  excel: 'Excel',
  manual: 'Manual',
  zip: 'Comprimido',
  other: 'Otro',
};

const FILE_TYPE_ICONS: Record<string, string> = {
  excel: '📊',
  manual: '📄',
  zip: '📦',
  other: '📁',
};

const FILE_ACCEPT = '.xlsx,.xls,.csv,.pdf,.zip,.rar,.7z';

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    tagline: '',
    badge: '',
    features: '',
    payment_url: '',
    paypal_url: '',
    category: '',
    sort_order: '0',
  });
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [guideFiles, setGuideFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<ProductFile[]>([]);
  const [filesToRemove, setFilesToRemove] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const guideInputRef = useRef<HTMLInputElement>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const { notify, confirm } = useNotification();

  const fetchProducts = () => {
    if (!token) return;
    api.getMyProducts(token)
      .then(setProducts)
      .catch((err) => {
        if (err.message.includes('401')) {
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', tagline: '', badge: '', features: '', payment_url: '', paypal_url: '', category: '', sort_order: '0' });
    setImageUpload(null);
    setImagePreview(null);
    setNewFiles([]);
    setGuideFiles([]);
    setExistingFiles([]);
    setFilesToRemove([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      tagline: product.tagline || '',
      badge: product.badge || '',
      features: product.features.join('\n'),
      payment_url: product.payment_url || '',
      paypal_url: product.paypal_url || '',
      category: product.category || '',
      sort_order: product.sort_order.toString(),
    });
    setImagePreview(product.image_url ? `${BACKEND_URL}${product.image_url}` : null);
    setExistingFiles(product.files || []);
    setNewFiles([]);
    setGuideFiles([]);
    setFilesToRemove([]);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUpload(file);
      setImagePreview(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const arr: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        arr.push(fileList[i]);
      }
      setNewFiles((prev) => [...prev, ...arr]);
    }
    e.target.value = '';
  };

  const handleGuideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const arr: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        arr.push(fileList[i]);
      }
      setGuideFiles((prev) => [...prev, ...arr]);
    }
    e.target.value = '';
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeGuideFile = (index: number) => {
    setGuideFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (url: string) => {
    setFilesToRemove((prev) => [...prev, url]);
    setExistingFiles((prev) => prev.filter((f) => f.url !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('tagline', form.tagline);
    formData.append('badge', form.badge);
    formData.append('features', JSON.stringify(form.features.split('\n').filter(f => f.trim())));
    formData.append('payment_url', form.payment_url);
    formData.append('paypal_url', form.paypal_url);
    formData.append('category', form.category);
    formData.append('sort_order', form.sort_order);
    formData.append('existingFiles', JSON.stringify(existingFiles));
    formData.append('removeFiles', JSON.stringify(filesToRemove));
    if (imageUpload) formData.append('image', imageUpload);
    newFiles.forEach((f) => formData.append('files_principal', f));
    guideFiles.forEach((f) => formData.append('files_manual', f));

    try {
      if (editingProduct) {
        await api.updateProduct(token, editingProduct.id, formData);
      } else {
        await api.createProduct(token, formData);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return; if (!(await confirm('¿Eliminar este producto?'))) return;
    try {
      await api.deleteProduct(token, id);
      fetchProducts();
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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
            <Link href="/" className="text-sm text-text-gray hover:text-rose-elegant transition-colors">
              Ver Landing
            </Link>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 transition-colors">
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-text-dark">Productos</h1>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="px-5 py-2.5 rounded-xl bg-rose-elegant text-white font-semibold text-sm hover:bg-rose-elegant/90 transition-all"
          >
            {showForm ? 'Cancelar' : '+ Nuevo Producto'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-rose-soft/50 p-8 shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-text-dark mb-6">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Precio (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Badge</label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder='Ej: "El más vendido"'
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Categoria</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Ej: Excel, Sistema, App"
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30"
                />
                <p className="text-[10px] text-text-gray mt-1">Agrupa productos por tipo. Usa la misma categoria para productos que van juntos en una landing.</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-dark mb-1.5">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-dark mb-1.5">Características (una por línea)</label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  rows={5}
                  placeholder="Registro de ventas&#10;Control básico de clientes&#10;Resumen mensual"
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30"
                />
              </div>

              {/* Links de pago */}
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">
                  Link de pago Culqi (S/ — Perú)
                </label>
                <input
                  type="url"
                  value={form.payment_url}
                  onChange={(e) => setForm({ ...form, payment_url: e.target.value })}
                  placeholder="https://checkout.culqi.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">
                  Link de pago PayPal ($ — Internacional)
                </label>
                <input
                  type="url"
                  value={form.paypal_url}
                  onChange={(e) => setForm({ ...form, paypal_url: e.target.value })}
                  placeholder="https://paypal.me/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30"
                />
              </div>

              {/* Imagen del plan */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-dark mb-1.5">Imagen del plan</label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm text-text-gray file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-rose-soft file:text-rose-elegant file:font-medium file:text-sm hover:file:bg-rose-elegant/20"
                      />
                    </div>
                    <p className="text-[10px] text-text-gray mt-1">
                      {editingProduct && !imageUpload ? 'Deja vacío para mantener la imagen actual' : 'Recomendado: 800x600px'}
                    </p>
                  </div>
                  {imagePreview && (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-rose-soft/50 flex-shrink-0 group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImageUpload(null); setImagePreview(null); }}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ARCHIVOS PRINCIPALES */}
              <div className="sm:col-span-2">
                <div className="bg-green-50/50 rounded-2xl border border-green-200/50 p-5">
                  <label className="block text-sm font-bold text-green-800 mb-1">
                    📊 Archivos Principales
                  </label>
                  <p className="text-[10px] text-green-600 mb-3">Excel, sistema, ZIP — el producto principal que el cliente descargará</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={FILE_ACCEPT}
                    multiple
                    onChange={handleFilesChange}
                    className="w-full text-sm text-text-gray file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-700 file:font-medium file:text-sm hover:file:bg-green-200/50"
                  />
                  {newFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {newFiles.map((f, i) => {
                        const ext = f.name.split('.').pop()?.toLowerCase() || '';
                        const icon = /xlsx?|csv/.test(ext) ? '📊' : /pdf/.test(ext) ? '📄' : /zip|rar|7z/.test(ext) ? '📦' : '📁';
                        return (
                          <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-green-200 shadow-sm">
                            <span>{icon}</span>
                            <span className="text-xs text-text-dark max-w-[120px] truncate">{f.name}</span>
                            <button type="button" onClick={() => removeNewFile(i)} className="text-red-400 hover:text-red-600 text-xs ml-1">✕</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* MANUALES / GUIAS */}
              <div className="sm:col-span-2">
                <div className="bg-blue-50/50 rounded-2xl border border-blue-200/50 p-5">
                  <label className="block text-sm font-bold text-blue-800 mb-1">
                    📄 Manuales / Guías / Instrucciones
                  </label>
                  <p className="text-[10px] text-blue-600 mb-3">Manual de usuario, guías, PDFs instructivos</p>
                  <input
                    ref={guideInputRef}
                    type="file"
                    accept={FILE_ACCEPT}
                    multiple
                    onChange={handleGuideChange}
                    className="w-full text-sm text-text-gray file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 file:font-medium file:text-sm hover:file:bg-blue-200/50"
                  />
                  {guideFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {guideFiles.map((f, i) => {
                        const ext = f.name.split('.').pop()?.toLowerCase() || '';
                        const icon = /pdf/.test(ext) ? '📄' : /xlsx?|csv/.test(ext) ? '📊' : /zip|rar|7z/.test(ext) ? '📦' : '📁';
                        return (
                          <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-blue-200 shadow-sm">
                            <span>{icon}</span>
                            <span className="text-xs text-text-dark max-w-[120px] truncate">{f.name}</span>
                            <button type="button" onClick={() => removeGuideFile(i)} className="text-red-400 hover:text-red-600 text-xs ml-1">✕</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Archivos existentes (de BD) */}
              {existingFiles.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-text-dark mb-2">Archivos guardados ({existingFiles.length})</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {existingFiles.map((f, i) => (
                      <div key={`${f.url}-${i}`} className="relative group bg-rose-light/50 rounded-xl p-3 border border-rose-soft/30 hover:border-rose-elegant/30 transition-all">
                        <div className="flex flex-col items-center text-center">
                          <span className="text-2xl mb-1">{FILE_TYPE_ICONS[f.type] || '📁'}</span>
                          <p className="text-xs font-medium text-text-dark truncate w-full">{f.name}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-soft/50 text-rose-elegant font-medium mt-1">{FILE_TYPE_LABELS[f.type] || f.type}</span>
                          <span className="text-[10px] text-text-gray mt-0.5">{formatSize(f.size)}</span>
                          <span className="text-[10px] text-text-gray mt-0.5">{f.category === 'guide' ? '📄 Manual' : '📊 Principal'}</span>
                        </div>
                        <button type="button" onClick={() => removeExistingFile(f.url)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Orden</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-soft/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-elegant/30"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 px-8 py-3 rounded-xl bg-rose-elegant text-white font-semibold text-sm hover:bg-rose-elegant/90 transition-all"
            >
              {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </form>
        )}

        <div className="grid gap-4">
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-rose-soft/50 p-12 text-center shadow-sm">
              <p className="text-text-gray">No hay productos aún. Crea tu primer plan.</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-rose-soft/50 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {product.image_url && (
                    <img
                      src={`${BACKEND_URL}${product.image_url}`}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-rose-soft/30 flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-text-dark truncate">{product.name}</h3>
                      {product.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-soft text-rose-elegant text-xs font-medium flex-shrink-0">
                          {product.badge}
                        </span>
                      )}
                      {!product.is_active && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-medium flex-shrink-0">
                          Inactivo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-gray truncate">{product.tagline}</p>
                    <p className="text-lg font-bold text-rose-elegant mt-1">S/ {product.price}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {product.payment_url && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                          Culqi link
                        </span>
                      )}
                      {product.paypal_url && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-600">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                          PayPal link
                        </span>
                      )}
                      {product.files && product.files.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-green-600">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          {product.files.length} archivo(s)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-4 py-2 rounded-lg border border-rose-soft text-text-dark text-sm hover:bg-rose-soft/30 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-4 py-2 rounded-lg border border-red-200 text-red-500 text-sm hover:bg-red-50 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
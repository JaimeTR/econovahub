'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useNotification } from '@/components/ui/NotificationProvider';

import { getApiUrl } from '@/lib/urls';

const API_URL = getApiUrl();

interface ProductFile {
  name: string;
  type: string;
  url: string;
  size?: number;
}

interface DownloadInfo {
  productName: string;
  files: ProductFile[];
  downloadsRemaining: number;
  expiresAt: string;
}

const FILE_META: Record<string, { icon: string; label: string; desc: string; color: string; bg: string }> = {
  excel: { icon: '📊', label: 'Archivo Principal', desc: 'Plantilla de Excel lista para usar', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  manual: { icon: '📄', label: 'Manual de Usuario', desc: 'Guía e instrucciones de uso', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  zip: { icon: '📦', label: 'Sistema / App', desc: 'Archivos del sistema o aplicación', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  other: { icon: '📁', label: 'Archivo Adicional', desc: 'Recurso complementario', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
};

export default function DescargarPage() {
  const params = useParams();
  const token = params?.token as string;

  const { notify } = useNotification();
  const [download, setDownload] = useState<DownloadInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [descargandoIndex, setDescargandoIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/downloads/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setDownload(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const descargar = async (index: number) => {
    setDescargandoIndex(index);
    try {
      const res = await fetch(`${API_URL}/downloads/${token}/file/${index}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al descargar');
      }
      const blob = await res.blob();
      const contentDisp = res.headers.get('Content-Disposition');
      const filename = contentDisp
        ? contentDisp.split('filename=')[1]?.replace(/"/g, '') || download?.files[index]?.name || 'archivo'
        : download?.files[index]?.name || 'archivo';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      notify('error', err.message || 'Error al descargar');
    }
    setDescargandoIndex(null);
  };

  const visualizar = (url: string) => {
    window.open(`${API_URL}/downloads/file/${token}?path=${encodeURIComponent(url)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-soft/20 to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-elegant border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-soft/20 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-soft/50 p-8 text-center shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-text-dark mb-2">Error al acceder a la descarga</h1>
          <p className="text-text-gray text-sm mb-6">{error}</p>
          <div className="flex flex-col gap-2">
            <Link href="/mis-compras" className="px-6 py-3 rounded-xl bg-rose-elegant text-white font-semibold text-sm hover:bg-rose-elegant/90 transition-all">
              Ir a Mis Compras
            </Link>
            <Link href="/" className="text-xs text-rose-elegant hover:underline">
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const files = download?.files || [];
  const hasFiles = files.length > 0;

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-soft/20 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-rose-elegant to-rose-elegant/80 rounded-3xl p-6 text-center shadow-xl mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-1">¡Descarga lista!</h1>
          <p className="text-white/80 text-sm">{download?.productName}</p>
        </div>

        <div className="space-y-4 mb-6">
          {hasFiles ? (
            files.map((file, i) => {
              const meta = FILE_META[file.type] || FILE_META.other;
              return (
                <div key={i} className={`rounded-2xl border p-5 ${meta.bg} shadow-sm`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-2xl">
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${meta.color}`}>
                          {meta.label}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/80 text-text-gray font-medium">
                          {file.type === 'excel' ? 'Excel' : file.type === 'manual' ? 'PDF' : file.type === 'zip' ? 'ZIP' : 'Archivo'}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-text-dark truncate">{file.name}</p>
                      <p className="text-xs text-text-gray mt-0.5">{meta.desc}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-text-gray">{formatSize(file.size)}</span>
                        <span className="text-[10px] text-text-gray">|</span>
                        <span className="text-[10px] text-text-gray">Exp: {download?.expiresAt ? new Date(download.expiresAt).toLocaleDateString('es-PE') : '—'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => visualizar(file.url)}
                      className="flex-1 py-2.5 rounded-xl border border-current text-text-gray text-xs font-medium hover:bg-white/50 transition-all">
                      Visualizar
                    </button>
                    <button onClick={() => descargar(i)} disabled={descargandoIndex === i}
                      className="flex-1 py-2.5 rounded-xl bg-rose-elegant text-white text-xs font-semibold hover:bg-rose-elegant/90 transition-all disabled:opacity-50">
                      {descargandoIndex === i ? 'Descargando...' : 'Descargar'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-rose-soft/20 rounded-2xl p-8 text-center">
              <p className="text-sm text-text-gray">No hay archivos disponibles para este producto</p>
            </div>
          )}
        </div>

        {/* Info descargas restantes */}
        <div className="bg-white rounded-2xl border border-rose-soft/30 p-4 shadow-sm mb-6">
          <div className="flex items-center justify-center gap-6 text-xs text-text-gray">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {download?.downloadsRemaining ?? 5} descargas restantes
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Expira: {download?.expiresAt ? new Date(download.expiresAt).toLocaleDateString('es-PE') : '—'}
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-2">
          <Link href="/mis-compras"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white border border-rose-soft/50 text-text-gray text-sm hover:bg-rose-soft/20 transition-all shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Ver todas mis compras
          </Link>
          <Link href="/"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white border border-rose-soft/50 text-text-gray text-sm hover:bg-rose-soft/20 transition-all shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Volver a la tienda
          </Link>
        </div>

        <p className="text-center text-[10px] text-text-gray mt-6">
          Link seguro · Expira en 72h · Max {download?.downloadsRemaining ?? 5} descargas
        </p>
      </div>
    </div>
  );
}
'use client';

import { useState, type ChangeEvent } from 'react';
import type { Media } from '@/media/media.types';
import { uploadMedia } from '../admin/(protected)/media/actions';

interface MediaLibraryProps {
  items: Media[];
  onSelect: (media: Media) => void;
  onUploaded: (media: Media) => void;
  onClose: () => void;
}

// Modal tipo Gutenberg: lista la biblioteca, permite subir y devolver la imagen
// elegida. No incrusta la imagen: el llamador guarda solo el puntero (id).
export function MediaLibrary({ items, onSelect, onUploaded, onClose }: MediaLibraryProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setError(null);
    try {
      const media = await uploadMedia(formData);
      onUploaded(media);
      onSelect(media);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Biblioteca de medios</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-slate-200 p-4">
          <label className="cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800">
            Subir imagen
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {uploading && <span className="text-sm text-slate-500">Subiendo…</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>

        <div className="grid grid-cols-3 gap-3 overflow-auto p-4 sm:grid-cols-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="overflow-hidden rounded-md border border-slate-200 text-left hover:border-slate-900"
            >
              <div className="aspect-square bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.alt ?? item.original_name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="block truncate p-1 text-xs text-slate-600" title={item.original_name}>
                {item.original_name}
              </span>
            </button>
          ))}
          {items.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-slate-500">
              No hay imágenes todavía. Sube una con el botón de arriba.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

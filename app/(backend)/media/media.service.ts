import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { mediaRepository } from '@/db/repositories/media.repository';
import type { Media, MediaMap } from './media.types';

// Los ficheros se guardan en public/uploads/<año>/<mes>/ y se sirven como
// /uploads/<año>/<mes>/<fichero>.
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOADS_DIRNAME = 'uploads';

export async function listMedia(): Promise<Media[]> {
  return mediaRepository.list();
}

// Resuelve un conjunto de punteros (media_id) a {url, alt} para el render SSR.
export async function getMediaMap(ids: string[]): Promise<MediaMap> {
  const unique = [...new Set(ids)].filter(Boolean);
  if (unique.length === 0) return {};
  const items = await mediaRepository.findByIds(unique);
  const map: MediaMap = {};
  for (const item of items) {
    map[item.id] = { url: item.url, alt: item.alt };
  }
  return map;
}

// Guarda un fichero subido en public/uploads/<año>/<mes>/ y registra el metadato.
export async function saveUpload(file: File): Promise<Media> {
  if (!file || file.size === 0) {
    throw new Error('No se recibió ningún archivo');
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('Solo se permiten imágenes');
  }

  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const relativeDir = path.join(UPLOADS_DIRNAME, year, month);
  const absoluteDir = path.join(PUBLIC_DIR, relativeDir);
  await mkdir(absoluteDir, { recursive: true });

  const filename = `${Date.now()}-${sanitizeName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(absoluteDir, filename), buffer);

  // URL pública siempre con separadores '/'.
  const url = `/${UPLOADS_DIRNAME}/${year}/${month}/${filename}`;

  return mediaRepository.create({
    url,
    filename,
    original_name: file.name,
    mime_type: file.type,
    size: file.size,
    alt: null,
  });
}

// Normaliza el nombre original a un slug seguro conservando la extensión.
function sanitizeName(name: string): string {
  const dot = name.lastIndexOf('.');
  const rawBase = dot >= 0 ? name.slice(0, dot) : name;
  const rawExt = dot >= 0 ? name.slice(dot) : '';
  const base =
    rawBase
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'archivo';
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9.]/g, '');
  return `${base}${ext}`;
}

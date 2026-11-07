// Tipos de la biblioteca de medios.

export interface Media {
  id: string;
  url: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  alt: string | null;
  created_at: Date;
}

// Referencia mínima para resolver el "puntero" (media_id) de un bloque en el render.
export interface MediaRef {
  url: string;
  alt: string | null;
}

export type MediaMap = Record<string, MediaRef>;

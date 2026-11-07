import type { Metadata } from 'next';
import '../(backend)/globals.css';

export const metadata: Metadata = {
  title: 'Dalia',
  description: 'Sitio público de Dalia CMS',
};

// Root layout del sitio público. Convive con el root layout del panel
// (app/(backend)/layout.tsx) gracias al patrón de múltiples root layouts:
// cada route group define su propio <html>/<body>.
export default function FrontendLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}

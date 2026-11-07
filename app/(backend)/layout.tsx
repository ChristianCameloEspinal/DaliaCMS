import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dalia CMS',
  description: 'Panel de administración de Dalia CMS',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full">
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}

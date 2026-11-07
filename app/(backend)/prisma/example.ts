import { randomUUID } from 'node:crypto';

// Contenido de ejemplo: una landing de una agencia de marketing ("Pulse
// Studio"), para ver el CMS renderizando bloques. Se usa desde el seed.

type ExampleBlock = {
  id: string;
  type: 'heading' | 'paragraph' | 'quote' | 'image' | 'group' | 'columns' | 'column';
  text: string;
  url?: string;
  style?: Record<string, string>;
  align?: 'wide' | 'full';
  layout?: Record<string, unknown>;
  children?: ExampleBlock[];
};

function block(data: Omit<ExampleBlock, 'id'>): ExampleBlock {
  return { id: randomUUID(), ...data };
}

// Columna con un título coloreado y un párrafo (para el bloque «columns»).
function column(title: string, color: string, body: string): ExampleBlock {
  return block({
    type: 'column',
    text: '',
    layout: { gap: '8px' },
    children: [
      block({ type: 'heading', text: title, style: { color, fontSize: '1.5rem' } }),
      block({ type: 'paragraph', text: body }),
    ],
  });
}

const blocks: ExampleBlock[] = [
  block({
    type: 'paragraph',
    text: 'Impulsamos marcas con estrategias creativas basadas en datos. Diseño, contenido y publicidad que convierten.',
    style: { textAlign: 'center', fontSize: '1.5rem', color: '#475569' },
  }),
  block({
    type: 'image',
    text: 'Equipo de Pulse Studio trabajando',
    url: 'https://picsum.photos/seed/pulse-hero/1600/700',
    align: 'full',
    style: { borderRadius: '16px' },
  }),
  block({
    type: 'heading',
    text: 'Lo que hacemos',
    style: { textAlign: 'center', fontSize: '2.25rem', color: '#6d28d9', marginTop: '2rem' },
  }),
  block({
    type: 'paragraph',
    text: 'Servicios end-to-end para que tu negocio destaque en cada canal.',
    style: { textAlign: 'center', color: '#475569' },
  }),
  // Tres servicios en columnas (bloque «columns» con tres «column»).
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '32px', align: 'flex-start' },
    children: [
      column('SEO & Contenido', '#6d28d9', 'Posicionamos tu web en los primeros resultados con una estrategia de contenidos que atrae y fideliza a tu audiencia.'),
      column('Publicidad Digital', '#db2777', 'Campañas en Google y Meta optimizadas al detalle para maximizar tu retorno de inversión publicitaria.'),
      column('Branding & Diseño', '#f59e0b', 'Creamos una identidad visual memorable: logotipo, sistema gráfico y guías de marca coherentes en todos los soportes.'),
    ],
  }),
  block({
    type: 'quote',
    text: '«Pulse triplicó nuestras conversiones en solo 6 meses. Un equipo que entiende el negocio, no solo el marketing.»',
    align: 'wide',
    style: {
      backgroundColor: '#f8fafc',
      padding: '28px',
      borderRadius: '12px',
      fontSize: '1.25rem',
    },
  }),
  block({
    type: 'heading',
    text: 'Resultados que hablan',
    style: { textAlign: 'center', fontSize: '2rem', marginTop: '2rem' },
  }),
  block({
    type: 'paragraph',
    text: '+250 proyectos entregados · +180% ROAS medio · 12 premios de la industria',
    style: { textAlign: 'center', fontSize: '1.25rem', fontWeight: '700', color: '#6d28d9' },
  }),
  block({
    type: 'image',
    text: 'Panel de métricas de campañas',
    url: 'https://picsum.photos/seed/pulse-metrics/1200/520',
    align: 'wide',
    style: { borderRadius: '12px' },
  }),
  block({
    type: 'heading',
    text: '¿Listos para crecer?',
    style: { textAlign: 'center', fontSize: '2rem', color: '#6d28d9' },
  }),
  block({
    type: 'paragraph',
    text: 'Escríbenos a hola@pulse.studio y diseñemos juntos tu próxima campaña.',
    style: { textAlign: 'center', fontSize: '1.125rem', color: '#475569' },
  }),
];

export const EXAMPLE_PAGE = {
  post_type: 'page',
  post_name: 'agencia',
  post_title: 'Pulse Studio — Agencia de Marketing Digital',
  post_excerpt:
    'Agencia de marketing digital: SEO, publicidad, branding y diseño para hacer crecer tu marca.',
  post_status: 'published',
  post_meta_title: 'Pulse Studio | Agencia de Marketing Digital',
  post_meta_description:
    'Estrategias creativas basadas en datos: SEO, publicidad en Google y Meta, branding y diseño. +180% de ROAS medio.',
  post_content: JSON.stringify({ version: 1, blocks }),
};

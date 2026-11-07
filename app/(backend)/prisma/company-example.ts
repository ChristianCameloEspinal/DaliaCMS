import { randomUUID } from 'node:crypto';

// Landing de ejemplo para probar el render publico y el editor con contenido
// cercano a una web real de empresa.

export const EXAMPLE_VARIABLES = [
  { id: 'base-color', key: '--dalia-color-base', value: '#f8f5ef', type: 'color' },
  { id: 'text-color', key: '--dalia-color-contrast', value: '#1f2933', type: 'color' },
  { id: 'primary-color', key: '--color-primary', value: '#2f5d50', type: 'color' },
  { id: 'secondary-color', key: '--color-secondary', value: '#b26a3c', type: 'color' },
  { id: 'heading-font', key: '--dalia-font-heading', value: 'Georgia, "Times New Roman", serif', type: 'typography' },
  { id: 'body-font', key: '--dalia-font-body', value: 'system-ui, sans-serif', type: 'typography' },
  { id: 'content-width', key: '--dalia-content-size', value: '760px', type: 'spacing' },
  { id: 'wide-width', key: '--dalia-wide-size', value: '1180px', type: 'spacing' },
  { id: 'content-padding', key: '--dalia-content-padding', value: '56px', type: 'spacing' },
] as const;

type ExampleBlock = {
  id: string;
  type: 'heading' | 'paragraph' | 'quote' | 'list' | 'image' | 'group' | 'columns' | 'column';
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

function paragraph(text: string, style?: Record<string, string>): ExampleBlock {
  return block({ type: 'paragraph', text, style });
}

function heading(text: string, style?: Record<string, string>): ExampleBlock {
  return block({ type: 'heading', text, style });
}

function image(
  text: string,
  url: string,
  align: 'wide' | 'full' = 'wide',
  style?: Record<string, string>
): ExampleBlock {
  return block({ type: 'image', text, url, align, style });
}

function serviceColumn(title: string, body: string, details: string): ExampleBlock {
  return block({
    type: 'column',
    text: '',
    layout: { gap: '14px' },
    style: {
      backgroundColor: '#ffffff',
      border: '1px solid #e7ded1',
      borderRadius: '18px',
      padding: '28px',
    },
    children: [
      heading(title, { color: '#2f5d50', fontSize: '1.45rem', margin: '0' }),
      paragraph(body, { color: '#4b5563', margin: '0' }),
      paragraph(details, {
        color: '#b26a3c',
        fontSize: '0.95rem',
        fontWeight: '700',
        margin: '0',
      }),
    ],
  });
}

function galleryItem(title: string, url: string): ExampleBlock {
  return block({
    type: 'column',
    text: '',
    layout: { gap: '10px' },
    children: [
      image(title, url, 'wide', {
        aspectRatio: '4 / 3',
        objectFit: 'cover',
        borderRadius: '16px',
      }),
      paragraph(title, { color: '#4b5563', fontSize: '0.95rem', margin: '0' }),
    ],
  });
}

const blocks: ExampleBlock[] = [
  block({
    type: 'group',
    text: '',
    align: 'full',
    layout: { gap: '28px', align: 'center' },
    style: {
      backgroundColor: '#1f2933',
      color: '#ffffff',
      padding: '88px 24px 72px',
    },
    children: [
      paragraph('Nexo Habitat - Arquitectura sostenible en Madrid', {
        color: '#d9c7ad',
        fontSize: '0.95rem',
        fontWeight: '700',
        letterSpacing: '0.08em',
        textAlign: 'center',
        textTransform: 'uppercase',
      }),
      heading('Diseñamos espacios que reducen consumo, mejoran bienestar y envejecen con dignidad.', {
        color: '#ffffff',
        fontSize: '3.5rem',
        lineHeight: '1.05',
        margin: '0 auto',
        maxWidth: '980px',
        textAlign: 'center',
      }),
      paragraph(
        'Estudio especializado en viviendas pasivas, rehabilitacion energetica y espacios de trabajo saludables. Del anteproyecto a la direccion de obra, cuidamos cada decision material, tecnica y economica.',
        {
          color: '#e5e7eb',
          fontSize: '1.25rem',
          lineHeight: '1.7',
          margin: '0 auto',
          maxWidth: '760px',
          textAlign: 'center',
        }
      ),
      image(
        'Casa bioclimatica con patio interior y fachada de madera',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
        'wide',
        { borderRadius: '22px', maxHeight: '620px', objectFit: 'cover' }
      ),
    ],
  }),
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '32px', align: 'center', wrap: true },
    style: { marginTop: '64px', marginBottom: '56px' },
    children: [
      block({
        type: 'column',
        text: '',
        layout: { gap: '18px' },
        children: [
          paragraph('Intro', {
            color: '#b26a3c',
            fontSize: '0.9rem',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }),
          heading('Arquitectura con datos, oficio y sensibilidad por el lugar.', {
            color: '#2f5d50',
            fontSize: '2.4rem',
            lineHeight: '1.15',
            margin: '0',
          }),
        ],
      }),
      block({
        type: 'column',
        text: '',
        layout: { gap: '18px' },
        children: [
          paragraph(
            'Nexo Habitat nacio en 2016 para ayudar a familias, promotoras pequeñas y empresas a tomar mejores decisiones sobre sus edificios. Combinamos simulacion energetica, seleccion honesta de materiales y una direccion de obra cercana para evitar sorpresas.',
            { color: '#374151', fontSize: '1.05rem' }
          ),
          paragraph(
            'Trabajamos con presupuestos claros, proveedores locales y sistemas constructivos de baja huella. Nuestro objetivo no es firmar edificios llamativos, sino crear lugares comodos, duraderos y faciles de mantener.',
            { color: '#374151', fontSize: '1.05rem' }
          ),
        ],
      }),
    ],
  }),
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '24px', align: 'stretch', wrap: true },
    children: [
      serviceColumn(
        'Vivienda pasiva',
        'Proyectos de obra nueva con envolvente de alto rendimiento, ventilacion controlada y estudio solar desde la primera propuesta.',
        'Anteproyecto - Proyecto tecnico - Obra'
      ),
      serviceColumn(
        'Rehabilitacion energetica',
        'Auditoria del edificio, plan de fases, mejora de aislamiento, carpinterias, instalaciones y confort higrotermico.',
        'Diagnostico - Subvenciones - Ejecucion'
      ),
      serviceColumn(
        'Espacios de trabajo',
        'Oficinas, estudios y locales con criterios de salud ambiental, flexibilidad de uso, acustica y eficiencia operativa.',
        'Briefing - Interiorismo - Implantacion'
      ),
    ],
  }),
  block({
    type: 'group',
    text: '',
    align: 'wide',
    layout: { direction: 'row', gap: '24px', align: 'stretch', wrap: true },
    style: {
      backgroundColor: '#2f5d50',
      borderRadius: '24px',
      color: '#ffffff',
      marginTop: '56px',
      padding: '36px',
    },
    children: [
      paragraph('42 proyectos entregados', {
        color: '#ffffff',
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: '0',
      }),
      paragraph('31% de ahorro energetico medio tras rehabilitacion', {
        color: '#ffffff',
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: '0',
      }),
      paragraph('9.1/10 de satisfaccion en direccion de obra', {
        color: '#ffffff',
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: '0',
      }),
    ],
  }),
  heading('Galeria de proyectos recientes', {
    color: '#2f5d50',
    fontSize: '2.2rem',
    marginTop: '72px',
    textAlign: 'center',
  }),
  paragraph(
    'Una muestra de viviendas, reformas y espacios productivos donde el detalle tecnico se nota en el uso diario.',
    {
      color: '#4b5563',
      fontSize: '1.1rem',
      margin: '0 auto 24px',
      maxWidth: '720px',
      textAlign: 'center',
    }
  ),
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '22px', align: 'flex-start', wrap: true },
    children: [
      galleryItem(
        'Casa patio en la sierra: luz norte, madera laminada y cubierta vegetal.',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85'
      ),
      galleryItem(
        'Reforma de piso de los años 70 con mejora acustica y cocina abierta.',
        'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=85'
      ),
      galleryItem(
        'Estudio profesional con patio filtrante, luz regulable y mobiliario a medida.',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85'
      ),
    ],
  }),
  block({
    type: 'quote',
    text: 'Nos ayudaron a entender cada partida de la obra y a priorizar lo que realmente cambiaria el confort de la casa. Un año despues, la diferencia en consumo y temperatura es enorme.',
    align: 'wide',
    style: {
      backgroundColor: '#ffffff',
      border: '1px solid #e7ded1',
      borderRadius: '20px',
      color: '#1f2933',
      fontSize: '1.35rem',
      lineHeight: '1.7',
      marginTop: '56px',
      padding: '34px',
    },
  }),
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '32px', align: 'center', wrap: true },
    style: {
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      marginTop: '56px',
      padding: '40px',
    },
    children: [
      block({
        type: 'column',
        text: '',
        layout: { gap: '16px' },
        children: [
          heading('Como trabajamos', { color: '#2f5d50', fontSize: '2rem', margin: '0' }),
          block({
            type: 'list',
            text:
              'Escucha inicial y definicion de objetivos medibles\nEstudio energetico, normativo y economico\nPropuesta de diseño con fases y presupuesto realista\nDireccion de obra con seguimiento semanal y documentacion clara',
            style: { color: '#374151', fontSize: '1rem' },
          }),
        ],
      }),
      block({
        type: 'column',
        text: '',
        layout: { gap: '12px' },
        children: [
          paragraph('Agenda una primera consulta', {
            color: '#b26a3c',
            fontSize: '0.9rem',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }),
          paragraph('hola@nexohabitat.studio', {
            color: '#1f2933',
            fontSize: '1.4rem',
            fontWeight: '700',
            margin: '0',
          }),
          paragraph('Madrid - proyectos en toda la zona centro - reuniones online disponibles', {
            color: '#4b5563',
            margin: '0',
          }),
        ],
      }),
    ],
  }),
];

export const EXAMPLE_PAGE = {
  post_type: 'page',
  post_name: 'nexo-habitat',
  post_title: 'Nexo Habitat - Arquitectura sostenible',
  post_excerpt:
    'Estudio de arquitectura sostenible especializado en vivienda pasiva, rehabilitacion energetica y espacios de trabajo saludables.',
  post_status: 'published',
  post_meta_title: 'Nexo Habitat | Arquitectura sostenible en Madrid',
  post_meta_description:
    'Arquitectura sostenible en Madrid: vivienda pasiva, rehabilitacion energetica, espacios de trabajo saludables y direccion de obra cercana.',
  post_content: JSON.stringify({ version: 1, blocks }),
};

function infoCard(title: string, body: string): ExampleBlock {
  return block({
    type: 'column',
    text: '',
    layout: { gap: '10px' },
    style: {
      backgroundColor: '#ffffff',
      border: '1px solid #d9e6d1',
      borderRadius: '18px',
      padding: '24px',
    },
    children: [
      heading(title, { color: '#245b3a', fontSize: '1.35rem', margin: '0' }),
      paragraph(body, { color: '#435142', margin: '0' }),
    ],
  });
}

function habitatSection(
  title: string,
  intro: string,
  animals: string,
  imageUrl: string,
  reverse = false
): ExampleBlock {
  const textColumn = block({
    type: 'column',
    text: '',
    layout: { gap: '14px' },
    children: [
      paragraph('Habitat', {
        color: '#c07a2c',
        fontSize: '0.85rem',
        fontWeight: '700',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }),
      heading(title, { color: '#245b3a', fontSize: '2rem', lineHeight: '1.15', margin: '0' }),
      paragraph(intro, { color: '#374151', fontSize: '1.05rem' }),
      block({
        type: 'list',
        text: animals,
        style: { color: '#374151', fontSize: '1rem' },
      }),
    ],
  });

  const imageColumn = block({
    type: 'column',
    text: '',
    layout: { gap: '8px' },
    children: [
      image(title, imageUrl, 'wide', {
        aspectRatio: '4 / 3',
        objectFit: 'cover',
        borderRadius: '20px',
      }),
    ],
  });

  return block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '34px', align: 'center', wrap: true },
    style: {
      backgroundColor: '#ffffff',
      border: '1px solid #d9e6d1',
      borderRadius: '26px',
      marginTop: '28px',
      padding: '34px',
    },
    children: reverse ? [imageColumn, textColumn] : [textColumn, imageColumn],
  });
}

const zooBlocks: ExampleBlock[] = [
  block({
    type: 'group',
    text: '',
    align: 'full',
    layout: { gap: '26px', align: 'center' },
    style: {
      backgroundColor: '#173c2a',
      color: '#ffffff',
      padding: '88px 24px 70px',
    },
    children: [
      paragraph('Zooparque Atlantico - Naturaleza, educacion y conservacion', {
        color: '#f5d58b',
        fontSize: '0.95rem',
        fontWeight: '700',
        letterSpacing: '0.08em',
        textAlign: 'center',
        textTransform: 'uppercase',
      }),
      heading('Un dia para viajar por cinco habitats sin salir de la ciudad.', {
        color: '#ffffff',
        fontSize: '3.6rem',
        lineHeight: '1.05',
        margin: '0 auto',
        maxWidth: '980px',
        textAlign: 'center',
      }),
      paragraph(
        'Descubre mas de 240 especies, charlas con cuidadores, rutas familiares, zonas de descanso y programas de conservacion que conectan cada visita con proyectos reales de proteccion animal.',
        {
          color: '#e7f0dc',
          fontSize: '1.2rem',
          lineHeight: '1.7',
          margin: '0 auto',
          maxWidth: '780px',
          textAlign: 'center',
        }
      ),
      image(
        'Familia observando jirafas en Zooparque Atlantico',
        'https://images.unsplash.com/photo-1544985361-b420d7a77043?auto=format&fit=crop&w=1800&q=85',
        'wide',
        { borderRadius: '24px', maxHeight: '620px', objectFit: 'cover' }
      ),
    ],
  }),
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '20px', align: 'stretch', wrap: true },
    style: { marginTop: '48px' },
    children: [
      infoCard('Horario', 'Lunes a domingo de 10:00 a 20:00. Ultimo acceso a las 18:30. Horario nocturno los viernes de verano.'),
      infoCard('Entradas', 'Adultos 24 EUR, infantil 16 EUR, menores de 3 anos gratis. Descuentos para familias, colegios y mayores de 65.'),
      infoCard('Ubicacion', 'Avenida del Bosque 42. Parking gratuito, parada de bus en puerta y carril bici conectado al parque fluvial.'),
    ],
  }),
  heading('Habitats del parque', {
    color: '#245b3a',
    fontSize: '2.4rem',
    marginTop: '68px',
    textAlign: 'center',
  }),
  paragraph('Cada habitat esta disenado para explicar un ecosistema completo: clima, vegetacion, amenazas, especies clave y acciones de conservacion.', {
    color: '#435142',
    fontSize: '1.1rem',
    margin: '0 auto 20px',
    maxWidth: '760px',
    textAlign: 'center',
  }),
  habitatSection(
    'Sabana africana',
    'Una gran pradera abierta con miradores elevados, puntos de sombra y charlas diarias sobre herbivoros sociales y equilibrio del ecosistema.',
    'Jirafas reticuladas\nCebras de Grant\nSuricatas\nAvestruz comun\nAntilopes acuaticos',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85'
  ),
  habitatSection(
    'Selva tropical',
    'Un recorrido humedo y sombreado con vegetacion densa, pasarelas de madera y estaciones para entender la biodiversidad de los bosques lluviosos.',
    'Perezosos de dos dedos\nTamarinos emperador\nTucanes\nRanas flecha\nIguanas verdes',
    'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=85',
    true
  ),
  habitatSection(
    'Bosque iberico',
    'Zona dedicada a fauna local, recuperacion de especies heridas y educacion sobre convivencia responsable con los ecosistemas cercanos.',
    'Lince iberico\nBuitre leonado\nNutrias europeas\nCiervos\nAguilas calzadas',
    'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=85'
  ),
  habitatSection(
    'Humedal y aves migratorias',
    'Lagunas, observatorios silenciosos y paneles para seguir rutas migratorias. Ideal para visitantes que quieren fotografiar sin molestar.',
    'Flamencos\nIbis escarlata\nGarzas reales\nPatos colorados\nCiguenas blancas',
    'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?auto=format&fit=crop&w=1200&q=85',
    true
  ),
  habitatSection(
    'Costa y mundo marino',
    'Un espacio de aprendizaje sobre litoral, consumo responsable y plastico en los oceanos, con acuarios de especies pequenas y zona tactil supervisada.',
    'Pinguinos africanos\nRayas pequenas\nCaballitos de mar\nMedusas luna\nPeces payaso',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85'
  ),
  block({
    type: 'group',
    text: '',
    align: 'wide',
    layout: { direction: 'row', gap: '24px', align: 'stretch', wrap: true },
    style: {
      backgroundColor: '#245b3a',
      borderRadius: '24px',
      color: '#ffffff',
      marginTop: '56px',
      padding: '34px',
    },
    children: [
      paragraph('240+ especies bajo cuidado veterinario', { color: '#ffffff', fontSize: '1.4rem', fontWeight: '700', margin: '0' }),
      paragraph('18 programas educativos para colegios', { color: '#ffffff', fontSize: '1.4rem', fontWeight: '700', margin: '0' }),
      paragraph('7 proyectos activos de conservacion', { color: '#ffffff', fontSize: '1.4rem', fontWeight: '700', margin: '0' }),
    ],
  }),
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '28px', align: 'stretch', wrap: true },
    style: { marginTop: '56px' },
    children: [
      infoCard('Experiencias', 'Alimenta a las jirafas con cuidadores, visita el hospital veterinario en grupos reducidos o reserva una ruta al amanecer.'),
      infoCard('Conservacion', 'Parte de cada entrada financia cria responsable, rescate de fauna local, reforestacion y seguimiento de especies amenazadas.'),
      infoCard('Servicios', 'Restaurantes, areas de picnic, cambiadores, fuentes de agua, alquiler de carritos, taquillas, tienda y puntos de descanso.'),
    ],
  }),
  block({
    type: 'quote',
    text: 'Nuestra mision es que cada visitante salga sabiendo algo nuevo sobre los animales y una accion concreta para proteger su habitat.',
    align: 'wide',
    style: {
      backgroundColor: '#fff8e6',
      border: '1px solid #f0dba3',
      borderRadius: '22px',
      color: '#173c2a',
      fontSize: '1.35rem',
      lineHeight: '1.7',
      marginTop: '54px',
      padding: '32px',
    },
  }),
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '32px', align: 'center', wrap: true },
    style: {
      backgroundColor: '#ffffff',
      border: '1px solid #d9e6d1',
      borderRadius: '24px',
      marginTop: '56px',
      padding: '38px',
    },
    children: [
      block({
        type: 'column',
        text: '',
        layout: { gap: '16px' },
        children: [
          heading('Planifica tu visita', { color: '#245b3a', fontSize: '2rem', margin: '0' }),
          block({
            type: 'list',
            text:
              'Compra online para evitar colas\nLlega antes de las 11:30 para ver animales mas activos\nConsulta el calendario de charlas al entrar\nTrae botella reutilizable y calzado comodo\nReserva visitas escolares con 10 dias de antelacion',
            style: { color: '#374151', fontSize: '1rem' },
          }),
        ],
      }),
      block({
        type: 'column',
        text: '',
        layout: { gap: '12px' },
        children: [
          paragraph('Contacto y reservas', {
            color: '#c07a2c',
            fontSize: '0.9rem',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }),
          paragraph('reservas@zooparqueatlantico.org', {
            color: '#173c2a',
            fontSize: '1.35rem',
            fontWeight: '700',
            margin: '0',
          }),
          paragraph('Telefono: 900 421 421 - Atencion de 9:00 a 18:00', {
            color: '#435142',
            margin: '0',
          }),
        ],
      }),
    ],
  }),
];

const premiumZooBlocks: ExampleBlock[] = [
  block({
    type: 'group',
    text: '',
    align: 'full',
    layout: { gap: '30px', align: 'center' },
    style: {
      backgroundColor: '#11291d',
      backgroundImage:
        'linear-gradient(180deg, rgb(17 41 29 / 0.35), rgb(17 41 29 / 0.95))',
      color: '#ffffff',
      padding: '96px 24px 76px',
    },
    children: [
      paragraph('Bioparque Aurora - abre todos los dias de 10:00 a 20:00', {
        color: '#f7d889',
        fontSize: '0.95rem',
        fontWeight: '800',
        letterSpacing: '0.09em',
        textAlign: 'center',
        textTransform: 'uppercase',
      }),
      heading('No vengas solo a mirar animales. Ven a entender el mundo que los sostiene.', {
        color: '#ffffff',
        fontSize: '3.8rem',
        lineHeight: '1.03',
        margin: '0 auto',
        maxWidth: '1040px',
        textAlign: 'center',
      }),
      paragraph(
        'Cinco habitats inmersivos, encuentros con cuidadores, rutas para familias, un hospital visible al publico y proyectos de conservacion financiados por cada entrada. Una visita pensada para emocionar primero y dejar huella despues.',
        {
          color: '#eaf4df',
          fontSize: '1.22rem',
          lineHeight: '1.75',
          margin: '0 auto',
          maxWidth: '820px',
          textAlign: 'center',
        }
      ),
      image(
        'Pasarela entre vegetacion tropical en Bioparque Aurora',
        'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1800&q=85',
        'wide',
        { aspectRatio: '16 / 7', borderRadius: '28px', objectFit: 'cover' }
      ),
    ],
  }),
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '18px', align: 'stretch', wrap: true },
    style: { marginTop: '42px' },
    children: [
      infoCard('Compra inteligente', 'Entrada online desde 18 EUR, acceso rapido, cambio de fecha gratuito hasta 24 horas antes y packs familiares con merienda incluida.'),
      infoCard('Mejor hora', 'Entre 10:00 y 12:00 los animales estan mas activos. A las 17:30 empieza la ruta tranquila por humedales y bosque iberico.'),
      infoCard('Duracion ideal', 'Reserva entre 4 y 6 horas. El recorrido completo son 3,8 km con atajos, areas de sombra, agua y descanso cada pocos minutos.'),
    ],
  }),
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '34px', align: 'center', wrap: true },
    style: {
      backgroundColor: '#fff8e6',
      border: '1px solid #ecd9a4',
      borderRadius: '28px',
      marginTop: '56px',
      padding: '38px',
    },
    children: [
      block({
        type: 'column',
        text: '',
        layout: { gap: '16px' },
        children: [
          paragraph('La promesa', {
            color: '#b66d22',
            fontSize: '0.9rem',
            fontWeight: '800',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }),
          heading('Un parque que funciona como una historia: amanecer, viaje, descubrimiento y regreso.', {
            color: '#245b3a',
            fontSize: '2.25rem',
            lineHeight: '1.15',
            margin: '0',
          }),
        ],
      }),
      block({
        type: 'column',
        text: '',
        layout: { gap: '14px' },
        children: [
          paragraph(
            'Bioparque Aurora esta disenado para que cada zona tenga ritmo propio: sonidos, temperatura, vegetacion, miradores bajos para ninos, refugios de sombra para personas mayores y pequenas escenas que explican por que cada especie importa.',
            { color: '#374151', fontSize: '1.05rem' }
          ),
          paragraph(
            'No vendemos una lista de animales. Vendemos una experiencia de aprendizaje que empieza con asombro y termina con una accion concreta: apoyar, cuidar, reducir, volver.',
            { color: '#374151', fontSize: '1.05rem' }
          ),
        ],
      }),
    ],
  }),
  heading('Elige tu ruta', {
    color: '#245b3a',
    fontSize: '2.4rem',
    marginTop: '68px',
    textAlign: 'center',
  }),
  paragraph('Tres formas de vivir el parque segun tu tiempo, energia y curiosidad.', {
    color: '#435142',
    fontSize: '1.1rem',
    margin: '0 auto 22px',
    maxWidth: '720px',
    textAlign: 'center',
  }),
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '20px', align: 'stretch', wrap: true },
    children: [
      infoCard('Ruta Esencial - 2 h', 'Sabana, selva tropical y mirador de aves. Perfecta si vienes con ninos pequenos o tienes una manana corta.'),
      infoCard('Ruta Explorador - 4 h', 'Incluye todos los habitats, charla de cuidadores, zona de picnic y visita al laboratorio de conservacion.'),
      infoCard('Ruta Aurora - dia completo', 'Entrada temprana, encuentro con jirafas, comida en Terraza Baobab y paseo de atardecer por humedales.'),
    ],
  }),
  heading('Habitats que se sienten distintos', {
    color: '#245b3a',
    fontSize: '2.45rem',
    marginTop: '72px',
    textAlign: 'center',
  }),
  paragraph(
    'Cada area combina paisaje, relato y puntos de observacion tranquilos. La visita no va de correr de recinto en recinto; va de entrar en mundos.',
    {
      color: '#435142',
      fontSize: '1.1rem',
      margin: '0 auto 22px',
      maxWidth: '800px',
      textAlign: 'center',
    }
  ),
  habitatSection(
    'Sabana de luz dorada',
    'Una explanada amplia con hierbas altas, bebederos visibles y un mirador suspendido para entender jerarquias, migraciones y convivencia entre herbivoros.',
    'Jirafas reticuladas\nCebras de Grant\nSuricatas centinela\nAvestruz comun\nAntilopes acuaticos',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85'
  ),
  habitatSection(
    'Selva de niebla',
    'Pasarelas bajo vapor suave, sonidos de lluvia y vegetacion densa. Es la zona mas lenta: conviene parar, escuchar y mirar hacia arriba.',
    'Perezosos de dos dedos\nTamarinos emperador\nTucanes pico iris\nRanas flecha\nIguanas verdes',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=85',
    true
  ),
  habitatSection(
    'Bosque iberico recuperado',
    'Un espacio emocionalmente cercano: fauna local, rescate, rehabilitacion y pequenos gestos domesticos que ayudan a proteger lo que tenemos al lado.',
    'Lince iberico\nBuitre leonado\nNutrias europeas\nCiervos\nAguilas calzadas',
    'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=85'
  ),
  habitatSection(
    'Humedal de los viajes largos',
    'Observatorios silenciosos, prismas prestados y paneles para seguir rutas migratorias. La seccion favorita de fotografos y visitantes pacientes.',
    'Flamencos\nIbis escarlata\nGarzas reales\nPatos colorados\nCiguenas blancas',
    'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?auto=format&fit=crop&w=1200&q=85',
    true
  ),
  habitatSection(
    'Costa azul',
    'Acuarios de pequena escala, mensajes claros sobre plastico y pesca responsable, y una zona tactil guiada donde tocar significa aprender a respetar.',
    'Pinguinos africanos\nRayas pequenas\nCaballitos de mar\nMedusas luna\nPeces payaso',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85'
  ),
  block({
    type: 'group',
    text: '',
    align: 'wide',
    layout: { direction: 'row', gap: '22px', align: 'stretch', wrap: true },
    style: {
      backgroundColor: '#173c2a',
      borderRadius: '28px',
      color: '#ffffff',
      marginTop: '58px',
      padding: '38px',
    },
    children: [
      paragraph('247 animales bajo cuidado veterinario preventivo', { color: '#ffffff', fontSize: '1.35rem', fontWeight: '800', margin: '0' }),
      paragraph('12 crias nacidas en programas coordinados', { color: '#ffffff', fontSize: '1.35rem', fontWeight: '800', margin: '0' }),
      paragraph('64 colegios participan cada trimestre', { color: '#ffffff', fontSize: '1.35rem', fontWeight: '800', margin: '0' }),
      paragraph('7 proyectos de campo financiados por entradas', { color: '#ffffff', fontSize: '1.35rem', fontWeight: '800', margin: '0' }),
    ],
  }),
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '30px', align: 'stretch', wrap: true },
    style: { marginTop: '58px' },
    children: [
      infoCard('Agenda de hoy', '11:00 jirafas, 12:30 hospital veterinario, 15:00 selva tropical, 17:30 paseo por humedales, 19:00 cierre en mirador.'),
      infoCard('Para familias', 'Pulseras identificativas, cambiadores, carritos, menus infantiles, zonas de lactancia y rutas cortas sin escaleras.'),
      infoCard('Para amantes de la foto', 'Miradores sin cristal, zonas de silencio, luz recomendada por habitat y sesiones especiales al amanecer.'),
    ],
  }),
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '34px', align: 'center', wrap: true },
    style: {
      backgroundColor: '#ffffff',
      border: '1px solid #d9e6d1',
      borderRadius: '28px',
      marginTop: '58px',
      padding: '40px',
    },
    children: [
      block({
        type: 'column',
        text: '',
        layout: { gap: '16px' },
        children: [
          heading('Conservacion que puedes ver', { color: '#245b3a', fontSize: '2.15rem', margin: '0' }),
          paragraph(
            'El laboratorio no esta escondido. Desde una galeria acristalada puedes ver incubadoras, muestras, radiografias y el trabajo de enriquecimiento ambiental que prepara el equipo cada manana.',
            { color: '#374151', fontSize: '1.05rem' }
          ),
          block({
            type: 'list',
            text:
              'Rescate y recuperacion de fauna local\nCria coordinada de especies amenazadas\nCampanas contra el comercio ilegal\nReforestacion de corredores biologicos\nBecas para jovenes biologos y veterinarios',
            style: { color: '#374151', fontSize: '1rem' },
          }),
        ],
      }),
      block({
        type: 'column',
        text: '',
        layout: { gap: '12px' },
        children: [
          image(
            'Veterinaria revisando material de conservacion',
            'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=85',
            'wide',
            { aspectRatio: '4 / 3', borderRadius: '20px', objectFit: 'cover' }
          ),
        ],
      }),
    ],
  }),
  block({
    type: 'quote',
    text: 'Si una familia sale diciendo "no sabia que esto dependia de mi", el parque ya hizo su trabajo.',
    align: 'wide',
    style: {
      backgroundColor: '#fff8e6',
      border: '1px solid #ecd9a4',
      borderRadius: '24px',
      color: '#173c2a',
      fontSize: '1.45rem',
      lineHeight: '1.75',
      marginTop: '58px',
      padding: '36px',
    },
  }),
  block({
    type: 'columns',
    text: '',
    align: 'wide',
    layout: { gap: '32px', align: 'center', wrap: true },
    style: {
      backgroundColor: '#245b3a',
      borderRadius: '28px',
      color: '#ffffff',
      marginTop: '58px',
      padding: '42px',
    },
    children: [
      block({
        type: 'column',
        text: '',
        layout: { gap: '14px' },
        children: [
          heading('Ven cuando el parque despierta.', { color: '#ffffff', fontSize: '2.25rem', margin: '0' }),
          paragraph(
            'Reserva online, descarga el mapa y recibe una ruta recomendada segun edad, tiempo disponible y accesibilidad. La visita empieza antes de cruzar la puerta.',
            { color: '#eaf4df', fontSize: '1.05rem' }
          ),
        ],
      }),
      block({
        type: 'column',
        text: '',
        layout: { gap: '12px' },
        children: [
          paragraph('Entradas desde 18 EUR', { color: '#f7d889', fontSize: '1.35rem', fontWeight: '800', margin: '0' }),
          paragraph('reservas@bioparqueaurora.org', { color: '#ffffff', fontSize: '1.25rem', fontWeight: '700', margin: '0' }),
          paragraph('Avenida del Bosque 42 - Parking gratuito - Bus linea 18', { color: '#eaf4df', margin: '0' }),
        ],
      }),
    ],
  }),
];

export const ZOO_AURORA_PAGE = {
  version: 1,
  blocks: [
    {
      id: 'zoo-hero-001',
      type: 'hero',
      text: '',
      align: 'full',
      layout: {
        direction: 'column',
        gap: '24px',
        align: 'center',
        justify: 'center',
      },
      style: {
        minHeight: '620px',
        padding: '96px 24px',
        textAlign: 'center',
        backgroundColor: '#10251c',
        color: '#ffffff',
        borderRadius: '0px',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        {
          id: 'zoo-hero-badge-001',
          type: 'badge',
          text: 'Zoo Aurora · Naturaleza, ciencia y conservación',
          style: {
            backgroundColor: '#d8f3dc',
            color: '#174c31',
            borderRadius: '999px',
            paddingTop: '8px',
            paddingRight: '16px',
            paddingBottom: '8px',
            paddingLeft: '16px',
            fontWeight: '700',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          },
        },
        {
          id: 'zoo-hero-heading-001',
          type: 'heading',
          text: 'Un día completo entre fauna, rutas verdes y experiencias educativas',
          style: {
            color: '#ffffff',
            fontSize: '4rem',
            lineHeight: '1.02',
            maxWidth: '980px',
            margin: '0 auto',
            textAlign: 'center',
          },
          styleVariants: {
            desktop: {
              hover: {
                color: '#d8f3dc',
              },
            },
          },
        },
        {
          id: 'zoo-hero-paragraph-001',
          type: 'paragraph',
          text: 'Explora hábitats diseñados para aprender, caminar sin prisa y entender cómo se protege la biodiversidad. Esta página de demostración muestra rutas, precios, experiencias, enlaces externos y secciones comerciales usando los bloques del editor.',
          style: {
            color: '#edf7f0',
            fontSize: '1.25rem',
            lineHeight: '1.7',
            maxWidth: '780px',
            margin: '0 auto',
            textAlign: 'center',
          },
        },
        {
          id: 'zoo-hero-actions-001',
          type: 'group',
          text: '',
          layout: {
            direction: 'row',
            gap: '14px',
            align: 'center',
            justify: 'center',
            wrap: true,
          },
          children: [
            {
              id: 'zoo-hero-button-001',
              type: 'button',
              text: 'Comprar entradas',
              url: 'https://example.com/entradas-zoo-aurora',
              style: {
                backgroundColor: '#d8f3dc',
                color: '#10251c',
                borderRadius: '999px',
                paddingTop: '14px',
                paddingRight: '24px',
                paddingBottom: '14px',
                paddingLeft: '24px',
                fontWeight: '800',
                textDecoration: 'none',
              },
              styleVariants: {
                desktop: {
                  hover: {
                    backgroundColor: '#ffffff',
                    color: '#10251c',
                    transform: 'translateY(-2px)',
                  },
                },
              },
            },
            {
              id: 'zoo-hero-button-002',
              type: 'button',
              text: 'Ver cómo llegar',
              url: 'https://www.google.com/maps',
              style: {
                backgroundColor: 'transparent',
                color: '#ffffff',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#d8f3dc',
                borderRadius: '999px',
                paddingTop: '14px',
                paddingRight: '24px',
                paddingBottom: '14px',
                paddingLeft: '24px',
                fontWeight: '700',
                textDecoration: 'none',
              },
              styleVariants: {
                desktop: {
                  hover: {
                    backgroundColor: '#d8f3dc',
                    color: '#10251c',
                  },
                },
              },
            },
          ],
        },
      ],
    },

    {
      id: 'zoo-hero-image-001',
      type: 'image',
      text: 'Visitantes observando una zona natural del parque',
      url: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=1800&q=85',
      align: 'wide',
      style: {
        marginTop: '-80px',
        borderRadius: '28px',
        objectFit: 'cover',
        aspectRatio: '16 / 7',
        boxShadow: '0 24px 80px rgb(0 0 0 / 0.24)',
      },
      styleVariants: {
        desktop: {
          hover: {
            transform: 'scale(1.01)',
          },
        },
      },
    },

    {
      id: 'zoo-intro-columns-001',
      type: 'columns',
      text: '',
      align: 'wide',
      layout: {
        gap: '32px',
        align: 'center',
        wrap: true,
      },
      style: {
        marginTop: '72px',
        marginBottom: '48px',
      },
      children: [
        {
          id: 'zoo-intro-column-001',
          type: 'column',
          text: '',
          layout: {
            gap: '18px',
          },
          children: [
            {
              id: 'zoo-intro-eyebrow-001',
              type: 'eyebrow',
              text: 'Planifica tu visita',
              style: {
                color: '#2f6b45',
                fontWeight: '800',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              },
            },
            {
              id: 'zoo-intro-heading-001',
              type: 'heading',
              text: 'Una página pensada para vender entradas, orientar visitantes y explicar el proyecto',
              style: {
                color: '#10251c',
                fontSize: '2.6rem',
                lineHeight: '1.12',
                margin: '0',
              },
            },
          ],
        },
        {
          id: 'zoo-intro-column-002',
          type: 'column',
          text: '',
          layout: {
            gap: '18px',
          },
          children: [
            {
              id: 'zoo-intro-paragraph-001',
              type: 'paragraph',
              text: 'La estructura combina contenido editorial, tarjetas comerciales, llamadas a la acción, rutas de visita, precios, preguntas frecuentes y bloques visuales. Es una landing completa para probar el editor con una página realista.',
              style: {
                color: '#425466',
                fontSize: '1.08rem',
                lineHeight: '1.75',
              },
            },
            {
              id: 'zoo-intro-paragraph-002',
              type: 'paragraph',
              text: 'Todos los precios y rutas de Zoo Aurora son ficticios y están creados para una seed de demostración. Los enlaces externos apuntan a servicios genéricos o URLs de ejemplo.',
              style: {
                color: '#64748b',
                fontSize: '0.98rem',
                lineHeight: '1.65',
              },
            },
          ],
        },
      ],
    },

    {
      id: 'zoo-stats-001',
      type: 'group',
      text: '',
      align: 'wide',
      layout: {
        direction: 'row',
        gap: '18px',
        align: 'stretch',
        justify: 'space-between',
        wrap: true,
      },
      style: {
        backgroundColor: '#f0f7ef',
        borderRadius: '24px',
        padding: '28px',
        marginTop: '40px',
        marginBottom: '64px',
      },
      children: [
        {
          id: 'zoo-stat-001',
          type: 'stat',
          text: '3\nRutas de visita',
          style: {
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '24px',
            minWidth: '190px',
            color: '#10251c',
          },
        },
        {
          id: 'zoo-stat-002',
          type: 'stat',
          text: '6\nZonas temáticas',
          style: {
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '24px',
            minWidth: '190px',
            color: '#10251c',
          },
        },
        {
          id: 'zoo-stat-003',
          type: 'stat',
          text: '4\nExperiencias guiadas',
          style: {
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '24px',
            minWidth: '190px',
            color: '#10251c',
          },
        },
        {
          id: 'zoo-stat-004',
          type: 'stat',
          text: '100%\nContenido demo',
          style: {
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '24px',
            minWidth: '190px',
            color: '#10251c',
          },
        },
      ],
    },

    {
      id: 'zoo-prices-section-001',
      type: 'group',
      text: '',
      align: 'wide',
      layout: {
        direction: 'column',
        gap: '24px',
      },
      style: {
        marginTop: '56px',
        marginBottom: '56px',
      },
      children: [
        {
          id: 'zoo-prices-eyebrow-001',
          type: 'eyebrow',
          text: 'Entradas',
          style: {
            color: '#2f6b45',
            fontWeight: '800',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textAlign: 'center',
          },
        },
        {
          id: 'zoo-prices-heading-001',
          type: 'heading',
          text: 'Precios claros para distintos tipos de visita',
          style: {
            color: '#10251c',
            fontSize: '2.4rem',
            lineHeight: '1.15',
            textAlign: 'center',
            margin: '0 auto',
            maxWidth: '820px',
          },
        },
        {
          id: 'zoo-prices-columns-001',
          type: 'columns',
          text: '',
          layout: {
            gap: '22px',
            align: 'stretch',
            wrap: true,
          },
          children: [
            {
              id: 'zoo-price-card-001',
              type: 'column',
              text: '',
              layout: {
                gap: '14px',
              },
              style: {
                backgroundColor: '#ffffff',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#d9ead7',
                borderRadius: '22px',
                padding: '28px',
                boxShadow: '0 12px 32px rgb(16 37 28 / 0.08)',
              },
              children: [
                {
                  id: 'zoo-price-badge-001',
                  type: 'badge',
                  text: 'Individual',
                  style: {
                    backgroundColor: '#e9f7ec',
                    color: '#1f6f43',
                    borderRadius: '999px',
                    paddingTop: '6px',
                    paddingRight: '12px',
                    paddingBottom: '6px',
                    paddingLeft: '12px',
                    width: 'fit-content',
                  },
                },
                {
                  id: 'zoo-price-heading-001',
                  type: 'heading',
                  text: 'Entrada general',
                  style: {
                    color: '#10251c',
                    fontSize: '1.45rem',
                    margin: '0',
                  },
                },
                {
                  id: 'zoo-price-paragraph-001',
                  type: 'paragraph',
                  text: 'Adulto: 18 €\nInfantil: 12 €\nSenior: 14 €',
                  style: {
                    color: '#425466',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap',
                  },
                },
                {
                  id: 'zoo-price-button-001',
                  type: 'button',
                  text: 'Reservar entrada',
                  url: 'https://example.com/entradas-zoo-aurora/general',
                  style: {
                    backgroundColor: '#10251c',
                    color: '#ffffff',
                    borderRadius: '999px',
                    paddingTop: '12px',
                    paddingRight: '18px',
                    paddingBottom: '12px',
                    paddingLeft: '18px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    width: 'fit-content',
                  },
                  styleVariants: {
                    desktop: {
                      hover: {
                        backgroundColor: '#2f6b45',
                      },
                    },
                  },
                },
              ],
            },
            {
              id: 'zoo-price-card-002',
              type: 'column',
              text: '',
              layout: {
                gap: '14px',
              },
              style: {
                backgroundColor: '#10251c',
                color: '#ffffff',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#10251c',
                borderRadius: '22px',
                padding: '28px',
                boxShadow: '0 18px 48px rgb(16 37 28 / 0.22)',
              },
              children: [
                {
                  id: 'zoo-price-badge-002',
                  type: 'badge',
                  text: 'Más popular',
                  style: {
                    backgroundColor: '#d8f3dc',
                    color: '#10251c',
                    borderRadius: '999px',
                    paddingTop: '6px',
                    paddingRight: '12px',
                    paddingBottom: '6px',
                    paddingLeft: '12px',
                    width: 'fit-content',
                    fontWeight: '800',
                  },
                },
                {
                  id: 'zoo-price-heading-002',
                  type: 'heading',
                  text: 'Pase familiar',
                  style: {
                    color: '#ffffff',
                    fontSize: '1.45rem',
                    margin: '0',
                  },
                },
                {
                  id: 'zoo-price-paragraph-002',
                  type: 'paragraph',
                  text: '2 adultos + 2 menores: 48 €\nIncluye ruta recomendada\nAcceso a zona educativa',
                  style: {
                    color: '#e9f7ec',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap',
                  },
                },
                {
                  id: 'zoo-price-button-002',
                  type: 'button',
                  text: 'Comprar pase familiar',
                  url: 'https://example.com/entradas-zoo-aurora/familiar',
                  style: {
                    backgroundColor: '#d8f3dc',
                    color: '#10251c',
                    borderRadius: '999px',
                    paddingTop: '12px',
                    paddingRight: '18px',
                    paddingBottom: '12px',
                    paddingLeft: '18px',
                    textDecoration: 'none',
                    fontWeight: '800',
                    width: 'fit-content',
                  },
                  styleVariants: {
                    desktop: {
                      hover: {
                        backgroundColor: '#ffffff',
                      },
                    },
                  },
                },
              ],
            },
            {
              id: 'zoo-price-card-003',
              type: 'column',
              text: '',
              layout: {
                gap: '14px',
              },
              style: {
                backgroundColor: '#ffffff',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#d9ead7',
                borderRadius: '22px',
                padding: '28px',
                boxShadow: '0 12px 32px rgb(16 37 28 / 0.08)',
              },
              children: [
                {
                  id: 'zoo-price-badge-003',
                  type: 'badge',
                  text: 'Grupos',
                  style: {
                    backgroundColor: '#fff4df',
                    color: '#8a5a00',
                    borderRadius: '999px',
                    paddingTop: '6px',
                    paddingRight: '12px',
                    paddingBottom: '6px',
                    paddingLeft: '12px',
                    width: 'fit-content',
                  },
                },
                {
                  id: 'zoo-price-heading-003',
                  type: 'heading',
                  text: 'Visita educativa',
                  style: {
                    color: '#10251c',
                    fontSize: '1.45rem',
                    margin: '0',
                  },
                },
                {
                  id: 'zoo-price-paragraph-003',
                  type: 'paragraph',
                  text: 'Desde 9 € por alumno\nGuía educativo opcional\nMaterial previo para docentes',
                  style: {
                    color: '#425466',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap',
                  },
                },
                {
                  id: 'zoo-price-button-003',
                  type: 'button',
                  text: 'Solicitar grupo',
                  url: 'https://example.com/entradas-zoo-aurora/grupos',
                  style: {
                    backgroundColor: '#10251c',
                    color: '#ffffff',
                    borderRadius: '999px',
                    paddingTop: '12px',
                    paddingRight: '18px',
                    paddingBottom: '12px',
                    paddingLeft: '18px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    width: 'fit-content',
                  },
                  styleVariants: {
                    desktop: {
                      hover: {
                        backgroundColor: '#2f6b45',
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: 'zoo-divider-001',
      type: 'divider',
      text: '',
      align: 'wide',
      style: {
        marginTop: '64px',
        marginBottom: '64px',
        borderColor: '#d9ead7',
      },
    },

    {
      id: 'zoo-routes-section-001',
      type: 'group',
      text: '',
      align: 'wide',
      layout: {
        direction: 'column',
        gap: '24px',
      },
      children: [
        {
          id: 'zoo-routes-heading-001',
          type: 'heading',
          text: 'Tres rutas para recorrer el parque',
          style: {
            color: '#10251c',
            fontSize: '2.4rem',
            lineHeight: '1.15',
            textAlign: 'center',
            margin: '0 auto',
            maxWidth: '760px',
          },
        },
        {
          id: 'zoo-routes-paragraph-001',
          type: 'paragraph',
          text: 'Cada ruta está pensada para un ritmo distinto: visita rápida, recorrido familiar o experiencia completa con paradas educativas.',
          style: {
            color: '#64748b',
            fontSize: '1.08rem',
            lineHeight: '1.7',
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto',
          },
        },
        {
          id: 'zoo-routes-columns-001',
          type: 'columns',
          text: '',
          layout: {
            gap: '22px',
            align: 'stretch',
            wrap: true,
          },
          children: [
            {
              id: 'zoo-route-card-001',
              type: 'card',
              text: '',
              layout: {
                direction: 'column',
                gap: '12px',
              },
              style: {
                padding: '24px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#d9ead7',
                borderRadius: '18px',
                backgroundColor: '#ffffff',
              },
              styleVariants: {
                desktop: {
                  hover: {
                    boxShadow: '0 18px 44px rgb(16 37 28 / 0.16)',
                    transform: 'translateY(-3px)',
                  },
                },
              },
              children: [
                {
                  id: 'zoo-route-badge-001',
                  type: 'badge',
                  text: '45 min',
                  style: {
                    backgroundColor: '#e9f7ec',
                    color: '#1f6f43',
                    borderRadius: '999px',
                    paddingTop: '5px',
                    paddingRight: '10px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    width: 'fit-content',
                  },
                },
                {
                  id: 'zoo-route-heading-001',
                  type: 'heading',
                  text: 'Ruta Esencial',
                  style: {
                    fontSize: '1.35rem',
                    color: '#10251c',
                    margin: '0',
                  },
                },
                {
                  id: 'zoo-route-paragraph-001',
                  type: 'paragraph',
                  text: 'Entrada principal · Sabana · Aviario · Mirador del lago · Tienda de salida.',
                  style: {
                    color: '#425466',
                    lineHeight: '1.65',
                  },
                },
              ],
            },
            {
              id: 'zoo-route-card-002',
              type: 'card',
              text: '',
              layout: {
                direction: 'column',
                gap: '12px',
              },
              style: {
                padding: '24px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#d9ead7',
                borderRadius: '18px',
                backgroundColor: '#ffffff',
              },
              styleVariants: {
                desktop: {
                  hover: {
                    boxShadow: '0 18px 44px rgb(16 37 28 / 0.16)',
                    transform: 'translateY(-3px)',
                  },
                },
              },
              children: [
                {
                  id: 'zoo-route-badge-002',
                  type: 'badge',
                  text: '90 min',
                  style: {
                    backgroundColor: '#fff4df',
                    color: '#8a5a00',
                    borderRadius: '999px',
                    paddingTop: '5px',
                    paddingRight: '10px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    width: 'fit-content',
                  },
                },
                {
                  id: 'zoo-route-heading-002',
                  type: 'heading',
                  text: 'Ruta Familiar',
                  style: {
                    fontSize: '1.35rem',
                    color: '#10251c',
                    margin: '0',
                  },
                },
                {
                  id: 'zoo-route-paragraph-002',
                  type: 'paragraph',
                  text: 'Aviario · Primates · Granja educativa · Zona de descanso · Hábitat nocturno.',
                  style: {
                    color: '#425466',
                    lineHeight: '1.65',
                  },
                },
              ],
            },
            {
              id: 'zoo-route-card-003',
              type: 'card',
              text: '',
              layout: {
                direction: 'column',
                gap: '12px',
              },
              style: {
                padding: '24px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#d9ead7',
                borderRadius: '18px',
                backgroundColor: '#ffffff',
              },
              styleVariants: {
                desktop: {
                  hover: {
                    boxShadow: '0 18px 44px rgb(16 37 28 / 0.16)',
                    transform: 'translateY(-3px)',
                  },
                },
              },
              children: [
                {
                  id: 'zoo-route-badge-003',
                  type: 'badge',
                  text: '3 h',
                  style: {
                    backgroundColor: '#e7f0ff',
                    color: '#1d4ed8',
                    borderRadius: '999px',
                    paddingTop: '5px',
                    paddingRight: '10px',
                    paddingBottom: '5px',
                    paddingLeft: '10px',
                    width: 'fit-content',
                  },
                },
                {
                  id: 'zoo-route-heading-003',
                  type: 'heading',
                  text: 'Ruta Explorador',
                  style: {
                    fontSize: '1.35rem',
                    color: '#10251c',
                    margin: '0',
                  },
                },
                {
                  id: 'zoo-route-paragraph-003',
                  type: 'paragraph',
                  text: 'Recorrido completo con paradas de interpretación, miradores, talleres y zona de conservación.',
                  style: {
                    color: '#425466',
                    lineHeight: '1.65',
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: 'zoo-map-links-html-001',
      type: 'html',
      text: '<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin:32px 0 8px"><a href="https://www.google.com/maps" target="_blank" rel="noreferrer" style="padding:12px 18px;border-radius:999px;background:#10251c;color:#fff;text-decoration:none;font-weight:700">Abrir en Google Maps</a><a href="https://www.openstreetmap.org/" target="_blank" rel="noreferrer" style="padding:12px 18px;border-radius:999px;background:#e9f7ec;color:#10251c;text-decoration:none;font-weight:700">Ver en OpenStreetMap</a><a href="https://www.renfe.com/" target="_blank" rel="noreferrer" style="padding:12px 18px;border-radius:999px;background:#fff4df;color:#4a3415;text-decoration:none;font-weight:700">Consultar trenes</a></div>',
      align: 'wide',
    },

    {
      id: 'zoo-animal-zones-001',
      type: 'group',
      text: '',
      align: 'wide',
      layout: {
        direction: 'column',
        gap: '24px',
      },
      style: {
        marginTop: '72px',
        marginBottom: '56px',
      },
      children: [
        {
          id: 'zoo-zones-heading-001',
          type: 'heading',
          text: 'Zonas principales del parque',
          style: {
            color: '#10251c',
            fontSize: '2.4rem',
            textAlign: 'center',
            margin: '0',
          },
        },
        {
          id: 'zoo-zones-columns-001',
          type: 'columns',
          text: '',
          layout: {
            gap: '18px',
            align: 'stretch',
            wrap: true,
          },
          children: [
            {
              id: 'zoo-zone-001',
              type: 'column',
              text: '',
              layout: {
                gap: '10px',
              },
              children: [
                {
                  id: 'zoo-zone-img-001',
                  type: 'image',
                  text: 'Zona de sabana',
                  url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=85',
                  style: {
                    aspectRatio: '4 / 3',
                    objectFit: 'cover',
                    borderRadius: '18px',
                  },
                },
                {
                  id: 'zoo-zone-heading-001',
                  type: 'heading',
                  text: 'Sabana',
                  style: {
                    fontSize: '1.3rem',
                    color: '#10251c',
                    margin: '0',
                  },
                },
                {
                  id: 'zoo-zone-paragraph-001',
                  type: 'paragraph',
                  text: 'Miradores abiertos, puntos de sombra y lectura interpretativa sobre grandes herbívoros.',
                  style: {
                    color: '#64748b',
                    fontSize: '0.95rem',
                  },
                },
              ],
            },
            {
              id: 'zoo-zone-002',
              type: 'column',
              text: '',
              layout: {
                gap: '10px',
              },
              children: [
                {
                  id: 'zoo-zone-img-002',
                  type: 'image',
                  text: 'Aviario tropical',
                  url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=900&q=85',
                  style: {
                    aspectRatio: '4 / 3',
                    objectFit: 'cover',
                    borderRadius: '18px',
                  },
                },
                {
                  id: 'zoo-zone-heading-002',
                  type: 'heading',
                  text: 'Aviario',
                  style: {
                    fontSize: '1.3rem',
                    color: '#10251c',
                    margin: '0',
                  },
                },
                {
                  id: 'zoo-zone-paragraph-002',
                  type: 'paragraph',
                  text: 'Recorrido inmersivo con especies de pequeño formato y vegetación densa.',
                  style: {
                    color: '#64748b',
                    fontSize: '0.95rem',
                  },
                },
              ],
            },
            {
              id: 'zoo-zone-003',
              type: 'column',
              text: '',
              layout: {
                gap: '10px',
              },
              children: [
                {
                  id: 'zoo-zone-img-003',
                  type: 'image',
                  text: 'Hábitat de bosque',
                  url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=900&q=85',
                  style: {
                    aspectRatio: '4 / 3',
                    objectFit: 'cover',
                    borderRadius: '18px',
                  },
                },
                {
                  id: 'zoo-zone-heading-003',
                  type: 'heading',
                  text: 'Bosque húmedo',
                  style: {
                    fontSize: '1.3rem',
                    color: '#10251c',
                    margin: '0',
                  },
                },
                {
                  id: 'zoo-zone-paragraph-003',
                  type: 'paragraph',
                  text: 'Pasarelas, vegetación, zonas de observación silenciosa y contenido educativo.',
                  style: {
                    color: '#64748b',
                    fontSize: '0.95rem',
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: 'zoo-conservation-001',
      type: 'group',
      text: '',
      align: 'full',
      layout: {
        direction: 'column',
        gap: '24px',
        align: 'center',
      },
      style: {
        backgroundColor: '#10251c',
        color: '#ffffff',
        padding: '72px 24px',
        marginTop: '72px',
        marginBottom: '72px',
      },
      children: [
        {
          id: 'zoo-conservation-badge-001',
          type: 'badge',
          text: 'Conservación',
          style: {
            backgroundColor: '#d8f3dc',
            color: '#10251c',
            borderRadius: '999px',
            paddingTop: '6px',
            paddingRight: '14px',
            paddingBottom: '6px',
            paddingLeft: '14px',
            fontWeight: '800',
          },
        },
        {
          id: 'zoo-conservation-heading-001',
          type: 'heading',
          text: 'La visita también puede financiar educación ambiental',
          style: {
            color: '#ffffff',
            fontSize: '2.6rem',
            lineHeight: '1.12',
            textAlign: 'center',
            maxWidth: '820px',
            margin: '0 auto',
          },
        },
        {
          id: 'zoo-conservation-paragraph-001',
          type: 'paragraph',
          text: 'Esta sección demuestra cómo presentar un mensaje institucional sin perder conversión: explica propósito, conecta con programas educativos y conduce hacia una acción concreta.',
          style: {
            color: '#d8f3dc',
            fontSize: '1.1rem',
            lineHeight: '1.75',
            textAlign: 'center',
            maxWidth: '760px',
            margin: '0 auto',
          },
        },
        {
          id: 'zoo-conservation-button-001',
          type: 'button',
          text: 'Conocer programas',
          url: 'https://example.com/zoo-aurora/conservacion',
          style: {
            backgroundColor: '#d8f3dc',
            color: '#10251c',
            borderRadius: '999px',
            paddingTop: '14px',
            paddingRight: '22px',
            paddingBottom: '14px',
            paddingLeft: '22px',
            textDecoration: 'none',
            fontWeight: '800',
          },
          styleVariants: {
            desktop: {
              hover: {
                backgroundColor: '#ffffff',
                transform: 'translateY(-2px)',
              },
            },
          },
        },
      ],
    },

    {
      id: 'zoo-experiences-001',
      type: 'columns',
      text: '',
      align: 'wide',
      layout: {
        gap: '24px',
        align: 'stretch',
        wrap: true,
      },
      children: [
        {
          id: 'zoo-experience-text-001',
          type: 'column',
          text: '',
          layout: {
            gap: '18px',
          },
          children: [
            {
              id: 'zoo-experience-eyebrow-001',
              type: 'eyebrow',
              text: 'Experiencias',
              style: {
                color: '#2f6b45',
                fontWeight: '800',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              },
            },
            {
              id: 'zoo-experience-heading-001',
              type: 'heading',
              text: 'Actividades para convertir una visita en una experiencia guiada',
              style: {
                color: '#10251c',
                fontSize: '2.2rem',
                lineHeight: '1.15',
                margin: '0',
              },
            },
            {
              id: 'zoo-experience-list-001',
              type: 'list',
              text: 'Taller de huellas y rastros\nRuta al atardecer\nEncuentro educativo con cuidadores\nVisita escolar con material docente\nPase anual para familias',
              style: {
                color: '#425466',
                fontSize: '1.05rem',
                lineHeight: '1.8',
              },
            },
          ],
        },
        {
          id: 'zoo-experience-image-001',
          type: 'column',
          text: '',
          layout: {
            gap: '12px',
          },
          children: [
            {
              id: 'zoo-experience-img-001',
              type: 'image',
              text: 'Actividad educativa en un entorno natural',
              url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1200&q=85',
              style: {
                borderRadius: '24px',
                aspectRatio: '4 / 3',
                objectFit: 'cover',
                boxShadow: '0 18px 48px rgb(16 37 28 / 0.18)',
              },
            },
            {
              id: 'zoo-experience-caption-001',
              type: 'paragraph',
              text: 'Imagen externa usada como contenido de demostración.',
              style: {
                color: '#94a3b8',
                fontSize: '0.9rem',
                textAlign: 'center',
              },
            },
          ],
        },
      ],
    },

    {
      id: 'zoo-testimonial-001',
      type: 'testimonial',
      text: '“La página combina información útil con llamadas a la acción sin sentirse agresiva. Precios, rutas, preguntas frecuentes y reserva quedan claros desde el primer scroll.”\nEquipo de producto · Demo Zoo Aurora',
      align: 'wide',
      style: {
        padding: '32px',
        borderRadius: '24px',
        backgroundColor: '#f0f7ef',
        color: '#10251c',
        marginTop: '72px',
        marginBottom: '48px',
      },
    },

    {
      id: 'zoo-faq-001',
      type: 'accordion',
      text: '¿Los precios son reales?\nNo. Son precios ficticios para una seed de demostración y no corresponden a ningún zoológico real.\n\n¿Puedo enlazar páginas externas?\nSí. Esta seed usa botones con URL y un bloque HTML con enlaces externos a servicios genéricos.\n\n¿Qué ruta conviene para familias?\nEn la demo, la Ruta Familiar está pensada para 90 minutos e incluye zonas de descanso y actividades educativas.\n\n¿La página usa hover?\nSí. Algunos botones, tarjetas e imágenes incluyen styleVariants.desktop.hover, que es el formato confirmado en tus logs.\n\n¿La página es responsive?\nLa estructura usa columnas con wrap, maxWidth, width y layouts flexibles. No he añadido variantes tablet/mobile porque no hay un ejemplo confirmado de esa estructura en el material que me pasaste.',
      align: 'wide',
      style: {
        marginTop: '48px',
        marginBottom: '56px',
      },
    },

    {
      id: 'zoo-final-cta-001',
      type: 'group',
      text: '',
      align: 'wide',
      layout: {
        direction: 'column',
        gap: '18px',
        align: 'center',
      },
      style: {
        backgroundColor: '#f9faf5',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#d9ead7',
        borderRadius: '28px',
        padding: '56px 28px',
        textAlign: 'center',
        marginTop: '64px',
        marginBottom: '64px',
      },
      children: [
        {
          id: 'zoo-final-heading-001',
          type: 'heading',
          text: 'Reserva tu visita de demostración',
          style: {
            color: '#10251c',
            fontSize: '2.4rem',
            margin: '0',
          },
        },
        {
          id: 'zoo-final-paragraph-001',
          type: 'paragraph',
          text: 'Cierra la página con una llamada a la acción clara, enlaces externos y una ruta alternativa para quien todavía necesita más información.',
          style: {
            color: '#64748b',
            fontSize: '1.08rem',
            lineHeight: '1.7',
            maxWidth: '680px',
            margin: '0 auto',
          },
        },
        {
          id: 'zoo-final-actions-001',
          type: 'group',
          text: '',
          layout: {
            direction: 'row',
            gap: '14px',
            align: 'center',
            justify: 'center',
            wrap: true,
          },
          children: [
            {
              id: 'zoo-final-button-001',
              type: 'button',
              text: 'Comprar entradas',
              url: 'https://example.com/entradas-zoo-aurora',
              style: {
                backgroundColor: '#10251c',
                color: '#ffffff',
                borderRadius: '999px',
                paddingTop: '14px',
                paddingRight: '24px',
                paddingBottom: '14px',
                paddingLeft: '24px',
                textDecoration: 'none',
                fontWeight: '800',
              },
              styleVariants: {
                desktop: {
                  hover: {
                    backgroundColor: '#2f6b45',
                    transform: 'translateY(-2px)',
                  },
                },
              },
            },
            {
              id: 'zoo-final-button-002',
              type: 'button',
              text: 'Consultar transporte',
              url: 'https://www.google.com/maps',
              style: {
                backgroundColor: '#ffffff',
                color: '#10251c',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#10251c',
                borderRadius: '999px',
                paddingTop: '14px',
                paddingRight: '24px',
                paddingBottom: '14px',
                paddingLeft: '24px',
                textDecoration: 'none',
                fontWeight: '800',
              },
              styleVariants: {
                desktop: {
                  hover: {
                    backgroundColor: '#d8f3dc',
                  },
                },
              },
            },
          ],
        },
      ],
    },

    {
      id: 'zoo-footer-html-001',
      type: 'html',
      text: '<footer style="padding:28px 0;text-align:center;color:#64748b;font-size:14px"><p><strong>Zoo Aurora</strong> es una marca ficticia creada para una seed de demostración.</p><p><a href="https://example.com" target="_blank" rel="noreferrer" style="color:#2f6b45;font-weight:700">Web externa de ejemplo</a> · <a href="https://www.openstreetmap.org/" target="_blank" rel="noreferrer" style="color:#2f6b45;font-weight:700">Mapa externo</a></p></footer>',
      align: 'wide',
    },
  ],
} as const;

export const ZOO_EXAMPLE_PAGE = {
  post_type: 'page',
  post_name: 'zooparque-atlantico',
  post_title: 'Bioparque Aurora - Zoologico inmersivo y centro de conservacion',
  post_excerpt:
    'Una pagina completa y editorial para un zoologico inmersivo con habitats, rutas, experiencias, agenda, conservacion y servicios para visitantes.',
  post_status: 'published',
  post_meta_title: 'Bioparque Aurora | Zoologico inmersivo y conservacion',
  post_meta_description:
    'Visita Bioparque Aurora: cinco habitats inmersivos, rutas familiares, encuentros con cuidadores, agenda diaria y programas reales de conservacion.',
  post_content: JSON.stringify(ZOO_AURORA_PAGE),
};

export const EXAMPLE_PAGES = [EXAMPLE_PAGE, ZOO_EXAMPLE_PAGE] as const;

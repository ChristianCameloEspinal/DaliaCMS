'use client';

import { useMemo, useState, type ComponentType, type ReactNode, type SVGProps } from 'react';
import { ErrorAlert, SuccessAlert } from '@/components/ui/alert';
import {
  BoxAxisControl,
  BoxCornerControl,
  BoxSideControl,
  BoxTextSpacingControl,
} from '@/components/ui/box-control';
import { Button } from '@/components/ui/button';
import { ColorControl } from '@/components/ui/color-control';
import { Field } from '@/components/ui/field';
import { Group } from '@/components/ui/group';
import { IconToggleGroup } from '@/components/ui/icon-toggle-group';
import * as Icons from '@/components/ui/icons';
import { IconValueInput, Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { ShadowControl } from '@/components/ui/shadow-control';
import { FontSizeControl, PxInput, SpacingControl, pxToNumber } from '@/components/ui/size-control';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { VariableOptionsList, type IconValueVariable } from '@/components/ui/variable-options-list';

type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

const buttonVariants = ['primary', 'secondary', 'danger', 'ghost', 'subtle', 'collapsed'] as const;
const buttonSizes = ['md', 'sm', 'icon', 'iconSm', 'collapsed'] as const;

const toggleOptions = [
  { value: 'left', label: 'Izquierda', Icon: Icons.AlignLeftIcon },
  { value: 'center', label: 'Centro', Icon: Icons.AlignCenterIcon },
  { value: 'right', label: 'Derecha', Icon: Icons.AlignRightIcon },
] as const;

const sampleVariables: IconValueVariable[] = [
  { id: 'color-primary', key: '--color-primary', value: '#2563eb', type: 'color' },
  { id: 'space-md', key: '--space-md', value: '24px', type: 'spacing' },
  { id: 'font-body', key: '--font-body', value: 'Inter', type: 'font' },
];

export default function LibraryPage() {
  const [text, setText] = useState('Texto de ejemplo');
  const [textarea, setTextarea] = useState('Contenido multilinea\npara revisar textareas.');
  const [select, setSelect] = useState('medium');
  const [switchValue, setSwitchValue] = useState(true);
  const [toggleValue, setToggleValue] = useState<(typeof toggleOptions)[number]['value']>('center');
  const [iconValue, setIconValue] = useState('32px');
  const [color, setColor] = useState('#2563eb');
  const [shadow, setShadow] = useState('0 8px 24px #00000026');
  const [fontSize, setFontSize] = useState('1rem');
  const [spacing, setSpacing] = useState('1.5rem');
  const [boxSides, setBoxSides] = useState({ top: '8px', right: '12px', bottom: '8px', left: '12px' });
  const [boxCorners, setBoxCorners] = useState({
    topLeft: '8px',
    topRight: '8px',
    bottomRight: '8px',
    bottomLeft: '8px',
  });
  const [boxAxis, setBoxAxis] = useState({ horizontal: '16px', vertical: '12px' });
  const [textSpacing, setTextSpacing] = useState({ lineHeight: '1.5', letterSpacing: '0px' });

  const iconEntries = useMemo(
    () =>
      Object.entries(Icons)
        .filter(([name]) => name !== 'iconProps' && (name.endsWith('Icon') || name === 'NavChevron'))
        .sort(([left], [right]) => left.localeCompare(right)) as [string, SvgIcon][],
    []
  );

  return (
    <main className="space-y-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">UI Library</h1>
        <p className="text-sm text-slate-500">
          Inventario visual de primitivas reutilizables, controles del editor e iconos disponibles.
        </p>
      </header>

      <LibrarySection title="Botones">
        <div className="grid gap-4 lg:grid-cols-2">
          <PreviewBlock title="Variantes">
            <div className="flex flex-wrap gap-2">
              {buttonVariants.map((variant) => (
                <Button key={variant} type="button" variant={variant}>
                  {variant}
                </Button>
              ))}
            </div>
          </PreviewBlock>
          <PreviewBlock title="Tamanos">
            <div className="flex flex-wrap items-center gap-2">
              {buttonSizes.map((buttonSize) => (
                <Button key={buttonSize} type="button" variant="secondary" buttonSize={buttonSize}>
                  {buttonSize.startsWith('icon') || buttonSize === 'collapsed' ? (
                    <Icons.SaveIcon className="h-4 w-4" />
                  ) : (
                    buttonSize
                  )}
                </Button>
              ))}
            </div>
          </PreviewBlock>
        </div>
      </LibrarySection>

      <LibrarySection title="Formulario">
        <div className="grid gap-4 lg:grid-cols-2">
          <PreviewBlock title="Campos basicos">
            <Field label="Input" htmlFor="library-input" hint="Field + Label + Input">
              <Input id="library-input" value={text} onChange={(event) => setText(event.target.value)} />
            </Field>
            <Field label="Select" htmlFor="library-select" labelSize="xs">
              <Select
                id="library-select"
                value={select}
                onChange={(event) => setSelect(event.target.value)}
                options={[
                  { value: '', label: 'Auto' },
                  { value: 'small', label: 'Pequeno' },
                  { value: 'medium', label: 'Mediano' },
                  { value: 'large', label: 'Grande' },
                ]}
                className="w-full"
              />
            </Field>
            <Field label="Textarea" htmlFor="library-textarea" spacing="none">
              <Textarea
                id="library-textarea"
                rows={4}
                value={textarea}
                onChange={(event) => setTextarea(event.target.value)}
              />
            </Field>
          </PreviewBlock>

          <PreviewBlock title="Estados y controles">
            <div className="space-y-4">
              <div>
                <Label htmlFor="library-switch" className="mb-1 text-xs text-slate-600">
                  Switch
                </Label>
                <Switch
                  id="library-switch"
                  checked={switchValue}
                  leftLabel="Off"
                  rightLabel="On"
                  onChange={setSwitchValue}
                />
              </div>
              <Group label="IconToggleGroup">
                <IconToggleGroup
                  options={toggleOptions}
                  value={toggleValue}
                  onChange={(value) => value && setToggleValue(value)}
                  ariaLabel="Alineacion"
                  allowDeselect={false}
                />
              </Group>
              <SuccessAlert message="SuccessAlert con mensaje de confirmacion." />
              <ErrorAlert message="ErrorAlert con mensaje persistente." />
            </div>
          </PreviewBlock>
        </div>
      </LibrarySection>

      <LibrarySection title="Controles del editor">
        <div className="grid gap-4 xl:grid-cols-3">
          <PreviewBlock title="IconValueInput">
            <IconValueInput
              label="Ancho"
              icon={Icons.WidthIcon}
              value={iconValue}
              unitType="magnitude"
              hasVariable
              variableOptions={sampleVariables}
              onChange={setIconValue}
            />
          </PreviewBlock>

          <PreviewBlock title="ColorControl">
            <ColorControl
              value={color}
              hasVariable
              allowImage
              variableOptions={sampleVariables}
              onChange={setColor}
            />
          </PreviewBlock>

          <PreviewBlock title="Size controls">
            <div className="space-y-3">
              <Group label="FontSizeControl">
                <FontSizeControl value={fontSize} onChange={setFontSize} />
              </Group>
              <Group label="SpacingControl">
                <SpacingControl value={spacing} onChange={setSpacing} />
              </Group>
              <Group label="PxInput">
                <PxInput value={pxToNumber('24px')} onChange={() => undefined} />
              </Group>
            </div>
          </PreviewBlock>

          <PreviewBlock title="BoxSideControl">
            <BoxSideControl
              values={boxSides}
              onChange={(side, value) => setBoxSides((current) => ({ ...current, [side]: value }))}
              ariaLabel="Lados"
              variableOptions={sampleVariables}
            />
          </PreviewBlock>

          <PreviewBlock title="BoxCornerControl">
            <BoxCornerControl
              values={boxCorners}
              onChange={(corner, value) => setBoxCorners((current) => ({ ...current, [corner]: value }))}
              ariaLabel="Esquinas"
              variableOptions={sampleVariables}
            />
          </PreviewBlock>

          <PreviewBlock title="BoxAxis y texto">
            <div className="space-y-3">
              <BoxAxisControl
                values={boxAxis}
                onChange={(axis, value) => setBoxAxis((current) => ({ ...current, [axis]: value }))}
                ariaLabel="Ejes"
                variableOptions={sampleVariables}
              />
              <BoxTextSpacingControl
                values={textSpacing}
                onChange={(field, value) => setTextSpacing((current) => ({ ...current, [field]: value }))}
                ariaLabel="Espaciado de texto"
                variableOptions={sampleVariables}
              />
            </div>
          </PreviewBlock>

          <PreviewBlock title="ShadowControl">
            <ShadowControl
              value={shadow}
              variableOptions={sampleVariables}
              onChange={setShadow}
            />
          </PreviewBlock>

          <PreviewBlock title="VariableOptionsList">
            <VariableOptionsList variables={sampleVariables} />
          </PreviewBlock>
        </div>
      </LibrarySection>

      <LibrarySection title={`Iconos (${iconEntries.length})`}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {iconEntries.map(([name, Icon]) => (
            <div
              key={name}
              className="grid min-h-20 grid-rows-[1fr_auto] items-center justify-items-center gap-2 rounded-md border border-slate-200 bg-white p-3"
              title={name}
            >
              <Icon className="h-5 w-5 text-slate-700" />
              <code className="max-w-full truncate text-[11px] text-slate-500">{name}</code>
            </div>
          ))}
        </div>
      </LibrarySection>
    </main>
  );
}

function LibrarySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      {children}
    </section>
  );
}

function PreviewBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-3 text-sm font-semibold text-slate-900">{title}</div>
      {children}
    </div>
  );
}

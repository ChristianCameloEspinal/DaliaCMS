import type { MediaMap } from '@/media/media.types';
import type { Block, PatternBlockMap, StyleDevice, StyleState } from '../editor.types';
import { renderRegisteredBlock } from './block-registry';

export { containerLayoutStyle } from './block-registry';

// Wrapper presentacional de un bloque. El render concreto vive en el registry
// para que los tipos nativos y futuros bloques externos usen el mismo contrato.
export function BlockView({
  block,
  media,
  patterns,
  styleDevice,
  styleState,
  showHidden,
}: {
  block: Block;
  media?: MediaMap;
  patterns?: PatternBlockMap;
  styleDevice?: StyleDevice;
  styleState?: StyleState;
  showHidden?: boolean;
}) {
  return renderRegisteredBlock({ block, media, patterns, styleDevice, styleState, showHidden });
}

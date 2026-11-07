import { blockAlignStyle } from '@/core/editor-variables/editor-variables.styles';
import type { MediaMap } from '@/media/media.types';
import type { Block, PatternBlockMap } from '../editor.types';
import { BlockView } from './block-view';
import {
  blockVisibilityClassName,
  generateBlockVariantCss,
} from '../../../../(frontend)/helpers/block-style-css';

// Renderiza en servidor el contenido de un post (JSON de bloques o texto plano
// legacy) como HTML. Cada bloque se envuelve según su alineación (content / wide
// / full), usando las variables CSS que define el contenedor del tema. `media`
// resuelve los punteros de los bloques de imagen.
export function BlockRenderer({
  blocks,
  media,
  patterns,
}: {
  blocks: Block[];
  media?: MediaMap;
  patterns?: PatternBlockMap;
}) {
  if (blocks.length === 0) {
    return null;
  }

  const variantCss = generateBlockVariantCss(blocks, patterns);

  return (
    <>
      {variantCss && <style dangerouslySetInnerHTML={{ __html: variantCss }} />}
      <div className="space-y-6">
        {blocks.map((block) => (
          <div
            key={block.id}
            style={blockAlignStyle(block.align)}
            className={blockVisibilityClassName(block.id)}
          >
            <BlockView block={block} media={media} patterns={patterns} showHidden />
          </div>
        ))}
      </div>
    </>
  );
}

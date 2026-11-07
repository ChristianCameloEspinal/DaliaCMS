import { useCallback, useState } from 'react';

export interface BlockDropTarget {
  id: string;
  parentId: string | null;
  index: number;
  position: 'before' | 'after';
}

export function useBlockDragDrop({
  onMove,
}: {
  onMove: (draggingId: string, target: BlockDropTarget) => boolean;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<BlockDropTarget | null>(null);

  const handleDragStart = useCallback((id: string) => {
    setDraggingId(id);
    setDropTarget(null);
  }, []);

  const handleDragOver = useCallback(
    (target: BlockDropTarget) => {
      setDropTarget((current) => {
        if (draggingId === target.id) return current;
        if (
          current &&
          current.id === target.id &&
          current.parentId === target.parentId &&
          current.index === target.index &&
          current.position === target.position
        ) {
          return current;
        }
        return target;
      });
    },
    [draggingId]
  );

  const clear = useCallback(() => {
    setDraggingId(null);
    setDropTarget(null);
  }, []);

  const handleDrop = useCallback(
    (target: BlockDropTarget) => {
      if (!draggingId || draggingId === target.id) {
        clear();
        return false;
      }
      const moved = onMove(draggingId, target);
      clear();
      return moved;
    },
    [clear, draggingId, onMove]
  );

  const handleDragEnd = useCallback(() => {
    clear();
  }, [clear]);

  return {
    draggingId,
    dropTarget,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}

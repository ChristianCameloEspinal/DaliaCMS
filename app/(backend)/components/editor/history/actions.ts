import { parseDocument } from '@/components/editor/editor.helpers';
import type { Block } from '@/components/editor/editor.types';
import type { EditorPatternItem } from '@/components/editor/hooks/use-editor-patterns';

export const LOCAL_HISTORY_LIMIT = 50;

export interface EditorPageSettings {
  post_type: string;
  post_title: string;
  post_name: string;
  post_excerpt: string | null;
  post_status: string;
  post_meta_title: string | null;
  post_meta_description: string | null;
}

export interface EditorRevisionSummary {
  id: string;
  createdAt: string;
  label: string | null;
  actionType: string | null;
  snapshot: string;
}

export interface EditorSnapshot {
  blocks: Block[];
  patterns: EditorPatternItem[];
  selectedId: string | null;
  selectedPatternId: string | null;
}

export interface EditorHistoryEntry {
  id: string;
  label: string;
  createdAt: string;
  snapshot: EditorSnapshot;
}

interface EditorRevisionPatternSnapshot {
  id: string;
  label: string;
  content: string;
  isNew?: boolean;
}

export interface EditorRevisionSnapshot {
  version: number;
  content: string;
  patterns?: EditorRevisionPatternSnapshot[];
  settings?: Partial<EditorPageSettings>;
}

export interface RestoredRevisionSnapshot {
  blocks: Block[];
  patterns?: EditorPatternItem[];
  settings?: Partial<EditorPageSettings>;
}

export function cloneSnapshot(snapshot: EditorSnapshot): EditorSnapshot {
  return JSON.parse(JSON.stringify(snapshot)) as EditorSnapshot;
}

export function createHistoryEntry(label: string, snapshot: EditorSnapshot): EditorHistoryEntry {
  return {
    id: crypto.randomUUID(),
    label,
    createdAt: new Date().toISOString(),
    snapshot: cloneSnapshot(snapshot),
  };
}

export function pushHistoryEntry(
  history: EditorHistoryEntry[],
  entry: EditorHistoryEntry
): EditorHistoryEntry[] {
  return [...history, entry].slice(-LOCAL_HISTORY_LIMIT);
}

export function parseRevisionSnapshot(value: string): EditorRevisionSnapshot | null {
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.content !== 'string') return null;
    return parsed as EditorRevisionSnapshot;
  } catch {
    return null;
  }
}

export function restoreRevisionSnapshot(
  revision: EditorRevisionSummary,
  currentPatterns: EditorPatternItem[]
): RestoredRevisionSnapshot | null {
  const snapshot = parseRevisionSnapshot(revision.snapshot);
  if (!snapshot) return null;

  return {
    blocks: parseDocument(snapshot.content).blocks,
    patterns: snapshot.patterns
      ? restoreRevisionPatterns(snapshot.patterns, currentPatterns)
      : undefined,
    settings: snapshot.settings,
  };
}

function restoreRevisionPatterns(
  snapshotPatterns: EditorRevisionPatternSnapshot[],
  currentPatterns: EditorPatternItem[]
): EditorPatternItem[] {
  const patternMap = new Map(currentPatterns.map((pattern) => [pattern.id, pattern]));

  for (const pattern of snapshotPatterns) {
    const currentPattern = patternMap.get(pattern.id);
    patternMap.set(pattern.id, {
      ...currentPattern,
      id: pattern.id,
      label: pattern.label,
      blocks: parseDocument(pattern.content).blocks,
      isNew: pattern.isNew,
      dirty: true,
    });
  }

  return Array.from(patternMap.values());
}

import { patternRepository } from '@/db/repositories/pattern.repository';
import { parseDocument } from '@/components/editor/editor.helpers';
import type { PatternBlockMap } from '@/components/editor/editor.types';
import type { CreatePatternInput, Pattern, UpdatePatternInput } from './pattern.types';

function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'component'
  );
}

async function uniqueSlug(label: string): Promise<string> {
  const base = slugify(label);
  let candidate = base;
  let i = 2;
  while (await patternRepository.findBySlug(candidate)) {
    candidate = `${base}-${i}`;
    i += 1;
  }
  return candidate;
}

export async function listPatterns(): Promise<Pattern[]> {
  return patternRepository.findAll();
}

export async function getPatternById(id: string): Promise<Pattern | null> {
  return patternRepository.findById(id);
}

export async function getPatternsByIds(ids: string[]): Promise<Pattern[]> {
  return patternRepository.findManyByIds(Array.from(new Set(ids)));
}

export async function createPattern(input: CreatePatternInput): Promise<Pattern> {
  const pattern_label = input.pattern_label.trim();
  if (!pattern_label) {
    throw new Error('El nombre del Component es obligatorio');
  }
  return patternRepository.create({
    pattern_slug: await uniqueSlug(pattern_label),
    pattern_label,
    content: input.content,
  });
}

export async function updatePattern(id: string, input: UpdatePatternInput): Promise<Pattern> {
  const existing = await patternRepository.findById(id);
  if (!existing) {
    throw new Error('Component no encontrado');
  }
  const pattern_label = input.pattern_label?.trim();
  return patternRepository.update(id, {
    pattern_label: pattern_label || undefined,
    content: input.content,
  });
}

export async function deletePattern(id: string): Promise<void> {
  const existing = await patternRepository.findById(id);
  if (!existing) {
    throw new Error('Component no encontrado');
  }
  await patternRepository.delete(id);
}

export async function countPatterns(): Promise<number> {
  return patternRepository.count();
}

export async function getPatternBlockMap(ids: string[]): Promise<PatternBlockMap> {
  const patterns = await getPatternsByIds(ids);
  return Object.fromEntries(
    patterns.map((pattern) => [
      pattern.id,
      {
        label: pattern.pattern_label,
        blocks: parseDocument(pattern.content).blocks,
      },
    ])
  );
}

import { templateRepository } from '@/db/repositories/template.repository';
import {
  createTemplate,
  deleteTemplate,
  updateTemplate,
} from '@/core/templates/template.service';
import type { Template } from '@/core/templates/template.types';

jest.mock('@/db/repositories/template.repository');

const mockedRepo = templateRepository as jest.Mocked<typeof templateRepository>;

function makeTemplate(overrides: Partial<Template> = {}): Template {
  return {
    id: 'tpl_1',
    template_slug: 'landing',
    template_label: 'Landing',
    content_size: '672px',
    wide_size: '1100px',
    padding: '48px',
    background: '#ffffff',
    text_color: '#0f172a',
    content: null,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

const validInput = {
  template_slug: 'landing',
  template_label: 'Landing',
  content_size: '900px',
  wide_size: '1200px',
  padding: '64px',
  background: '#000000',
  text_color: '#ffffff',
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe('createTemplate', () => {
  it('rechaza un slug con formato inválido', async () => {
    await expect(createTemplate({ ...validInput, template_slug: 'Mi Plantilla' })).rejects.toThrow(
      /slug/
    );
  });

  it('rechaza una etiqueta vacía', async () => {
    mockedRepo.findBySlug.mockResolvedValue(null);
    await expect(createTemplate({ ...validInput, template_label: '  ' })).rejects.toThrow(
      /etiqueta es obligatoria/
    );
  });

  it('rechaza si el slug ya existe', async () => {
    mockedRepo.findBySlug.mockResolvedValue(makeTemplate());
    await expect(createTemplate(validInput)).rejects.toThrow(/Ya existe/);
  });

  it('normaliza el slug (trim + minúsculas) y crea', async () => {
    mockedRepo.findBySlug.mockResolvedValue(null);
    mockedRepo.create.mockResolvedValue(makeTemplate());

    await createTemplate({ ...validInput, template_slug: '  Landing  ' });

    expect(mockedRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ template_slug: 'landing', template_label: 'Landing' })
    );
  });
});

describe('updateTemplate', () => {
  it('rechaza una etiqueta vacía', async () => {
    await expect(
      updateTemplate('tpl_1', { ...validInput, template_label: '' })
    ).rejects.toThrow(/etiqueta es obligatoria/);
  });

  it('lanza error si la plantilla no existe', async () => {
    mockedRepo.findById.mockResolvedValue(null);
    await expect(updateTemplate('tpl_1', validInput)).rejects.toThrow(/no encontrada/);
  });

  it('actualiza los campos del contenedor', async () => {
    mockedRepo.findById.mockResolvedValue(makeTemplate());
    mockedRepo.update.mockResolvedValue(makeTemplate());

    await updateTemplate('tpl_1', validInput);

    expect(mockedRepo.update).toHaveBeenCalledWith(
      'tpl_1',
      expect.objectContaining({ content_size: '900px', padding: '64px' })
    );
  });
});

describe('deleteTemplate', () => {
  it('lanza error si la plantilla no existe', async () => {
    mockedRepo.findById.mockResolvedValue(null);
    await expect(deleteTemplate('tpl_1')).rejects.toThrow(/no encontrada/);
  });

  it('elimina una plantilla existente', async () => {
    mockedRepo.findById.mockResolvedValue(makeTemplate());
    mockedRepo.delete.mockResolvedValue(makeTemplate());

    await deleteTemplate('tpl_1');

    expect(mockedRepo.delete).toHaveBeenCalledWith('tpl_1');
  });
});

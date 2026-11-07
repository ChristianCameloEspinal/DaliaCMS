import { postTypeRepository } from '@/db/repositories/post-type.repository';
import {
  countPostTypes,
  createPostType,
  deletePostType,
  updatePostType,
} from '@/core/post-types/post-type.service';
import type { PostType } from '@/core/post-types/post-type.types';

jest.mock('@/db/repositories/post-type.repository');

const mockedRepo = postTypeRepository as jest.Mocked<typeof postTypeRepository>;

function makePostType(overrides: Partial<PostType> = {}): PostType {
  return {
    id: 'pt_1',
    post_type: 'service',
    post_type_label: 'Servicios',
    post_type_description: null,
    post_type_system: false,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

beforeEach(() => {
  jest.resetAllMocks();
});

describe('createPostType', () => {
  it('rechaza un post_type que no tiene formato slug', async () => {
    await expect(
      createPostType({ post_type: 'Servicio Especial', post_type_label: 'Servicios' })
    ).rejects.toThrow(/slug/);
  });

  it('rechaza si post_type_label está vacío', async () => {
    mockedRepo.findByType.mockResolvedValue(null);

    await expect(createPostType({ post_type: 'service', post_type_label: '  ' })).rejects.toThrow(
      /post_type_label es obligatorio/
    );
  });

  it('rechaza si el post_type ya existe', async () => {
    mockedRepo.findByType.mockResolvedValue(makePostType());

    await expect(
      createPostType({ post_type: 'service', post_type_label: 'Servicios' })
    ).rejects.toThrow(/Ya existe un post type/);
  });

  it('crea el post type con datos normalizados', async () => {
    mockedRepo.findByType.mockResolvedValue(null);
    mockedRepo.create.mockResolvedValue(makePostType());

    await createPostType({ post_type: 'SERVICE', post_type_label: '  Servicios  ' });

    expect(mockedRepo.create).toHaveBeenCalledWith({
      post_type: 'service',
      post_type_label: 'Servicios',
      post_type_description: undefined,
    });
  });
});

describe('updatePostType', () => {
  it('rechaza si post_type_label está vacío', async () => {
    await expect(updatePostType('pt_1', { post_type_label: '   ' })).rejects.toThrow(
      /post_type_label es obligatorio/
    );
  });

  it('actualiza la etiqueta y la descripción', async () => {
    mockedRepo.update.mockResolvedValue(makePostType({ post_type_label: 'Nuevo' }));

    await updatePostType('pt_1', { post_type_label: 'Nuevo', post_type_description: '  desc  ' });

    expect(mockedRepo.update).toHaveBeenCalledWith('pt_1', {
      post_type_label: 'Nuevo',
      post_type_description: 'desc',
    });
  });
});

describe('deletePostType', () => {
  it('lanza error si el post type no existe', async () => {
    mockedRepo.findById.mockResolvedValue(null);

    await expect(deletePostType('pt_1')).rejects.toThrow(/no encontrado/);
  });

  it('lanza error si el post type es de sistema', async () => {
    mockedRepo.findById.mockResolvedValue(makePostType({ post_type_system: true }));

    await expect(deletePostType('pt_1')).rejects.toThrow(/No se pueden eliminar post types del sistema/);
    expect(mockedRepo.delete).not.toHaveBeenCalled();
  });

  it('elimina el post type si no es de sistema', async () => {
    mockedRepo.findById.mockResolvedValue(makePostType({ post_type_system: false }));
    mockedRepo.delete.mockResolvedValue(makePostType());

    await deletePostType('pt_1');

    expect(mockedRepo.delete).toHaveBeenCalledWith('pt_1');
  });
});

describe('countPostTypes', () => {
  it('delega en el repositorio', async () => {
    mockedRepo.count.mockResolvedValue(3);

    await expect(countPostTypes()).resolves.toBe(3);
  });
});

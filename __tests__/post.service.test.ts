import { postRepository } from '@/db/repositories/post.repository';
import { postTypeRepository } from '@/db/repositories/post-type.repository';
import {
  changePostStatus,
  countPosts,
  countPostsByStatus,
  createPost,
  getPublishedPostByName,
  updatePost,
} from '@/core/posts/post.service';
import type { Post, PostStatus } from '@/core/posts/post.types';
import type { PostType } from '@/core/post-types/post-type.types';

jest.mock('@/db/repositories/post.repository');
jest.mock('@/db/repositories/post-type.repository');

const mockedPostRepo = postRepository as jest.Mocked<typeof postRepository>;
const mockedPostTypeRepo = postTypeRepository as jest.Mocked<typeof postTypeRepository>;

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: 'post_1',
    post_author_id: null,
    post_date: null,
    post_content: null,
    post_title: 'Título',
    post_excerpt: null,
    post_status: 'draft',
    post_name: 'titulo',
    post_type: 'page',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

function makePostType(overrides: Partial<PostType> = {}): PostType {
  return {
    id: 'pt_1',
    post_type: 'page',
    post_type_label: 'Páginas',
    post_type_description: null,
    post_type_system: true,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

beforeEach(() => {
  jest.resetAllMocks();
});

describe('createPost', () => {
  it('rechaza si post_title está vacío', async () => {
    await expect(
      createPost({ post_type: 'page', post_title: '  ', post_name: 'slug' })
    ).rejects.toThrow(/post_title es obligatorio/);
  });

  it('rechaza si post_name está vacío', async () => {
    await expect(
      createPost({ post_type: 'page', post_title: 'Título', post_name: '  ' })
    ).rejects.toThrow(/post_name es obligatorio/);
  });

  it('rechaza un post_status inválido', async () => {
    await expect(
      createPost({
        post_type: 'page',
        post_title: 'Título',
        post_name: 'slug',
        post_status: 'foo' as PostStatus,
      })
    ).rejects.toThrow(/post_status inválido/);
  });

  it('rechaza si el post_type no existe', async () => {
    mockedPostTypeRepo.findByType.mockResolvedValue(null);

    await expect(
      createPost({ post_type: 'unknown', post_title: 'Título', post_name: 'slug' })
    ).rejects.toThrow(/no existe/);
  });

  it('rechaza si post_name ya existe en ese post_type', async () => {
    mockedPostTypeRepo.findByType.mockResolvedValue(makePostType());
    mockedPostRepo.findByTypeAndName.mockResolvedValue(makePost({ id: 'otro' }));

    await expect(
      createPost({ post_type: 'page', post_title: 'Título', post_name: 'slug' })
    ).rejects.toThrow(/Ya existe un post con post_name/);
  });

  it('fija post_date al publicar', async () => {
    mockedPostTypeRepo.findByType.mockResolvedValue(makePostType());
    mockedPostRepo.findByTypeAndName.mockResolvedValue(null);
    mockedPostRepo.create.mockResolvedValue(makePost({ post_status: 'published' }));

    await createPost({
      post_type: 'page',
      post_title: 'Título',
      post_name: 'slug',
      post_status: 'published',
    });

    expect(mockedPostRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ post_status: 'published', post_date: expect.any(Date) })
    );
  });

  it('deja post_date en null por defecto (borrador)', async () => {
    mockedPostTypeRepo.findByType.mockResolvedValue(makePostType());
    mockedPostRepo.findByTypeAndName.mockResolvedValue(null);
    mockedPostRepo.create.mockResolvedValue(makePost());

    await createPost({ post_type: 'page', post_title: 'Título', post_name: 'slug' });

    expect(mockedPostRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ post_status: 'draft', post_date: null })
    );
  });
});

describe('updatePost', () => {
  it('lanza error si el post no existe', async () => {
    mockedPostRepo.findById.mockResolvedValue(null);

    await expect(
      updatePost('post_1', { post_title: 'Título', post_name: 'slug', post_status: 'draft' })
    ).rejects.toThrow(/no encontrado/);
  });

  it('rechaza si post_title está vacío', async () => {
    mockedPostRepo.findById.mockResolvedValue(makePost());

    await expect(
      updatePost('post_1', { post_title: '  ', post_name: 'slug', post_status: 'draft' })
    ).rejects.toThrow(/post_title es obligatorio/);
  });

  it('mantiene post_date si ya estaba publicado', async () => {
    const existingDate = new Date('2026-01-01T00:00:00.000Z');
    mockedPostRepo.findById.mockResolvedValue(
      makePost({ post_status: 'published', post_date: existingDate })
    );
    mockedPostRepo.findByTypeAndName.mockResolvedValue(null);
    mockedPostRepo.update.mockResolvedValue(makePost());

    await updatePost('post_1', { post_title: 'Título', post_name: 'slug', post_status: 'published' });

    expect(mockedPostRepo.update).toHaveBeenCalledWith(
      'post_1',
      expect.objectContaining({ post_date: existingDate })
    );
  });

  it('fija post_date al pasar de borrador a publicado', async () => {
    mockedPostRepo.findById.mockResolvedValue(makePost({ post_status: 'draft', post_date: null }));
    mockedPostRepo.findByTypeAndName.mockResolvedValue(null);
    mockedPostRepo.update.mockResolvedValue(makePost());

    await updatePost('post_1', { post_title: 'Título', post_name: 'slug', post_status: 'published' });

    expect(mockedPostRepo.update).toHaveBeenCalledWith(
      'post_1',
      expect.objectContaining({ post_date: expect.any(Date) })
    );
  });
});

describe('changePostStatus', () => {
  it('lanza error si el post no existe', async () => {
    mockedPostRepo.findById.mockResolvedValue(null);

    await expect(changePostStatus('post_1', 'published')).rejects.toThrow(/no encontrado/);
  });

  it('fija post_date al publicar si estaba vacío', async () => {
    mockedPostRepo.findById.mockResolvedValue(makePost({ post_status: 'draft', post_date: null }));
    mockedPostRepo.update.mockResolvedValue(makePost());

    await changePostStatus('post_1', 'published');

    expect(mockedPostRepo.update).toHaveBeenCalledWith('post_1', {
      post_status: 'published',
      post_date: expect.any(Date),
    });
  });

  it('mantiene post_date si ya estaba definido', async () => {
    const existingDate = new Date('2026-01-01T00:00:00.000Z');
    mockedPostRepo.findById.mockResolvedValue(
      makePost({ post_status: 'published', post_date: existingDate })
    );
    mockedPostRepo.update.mockResolvedValue(makePost());

    await changePostStatus('post_1', 'archived');

    expect(mockedPostRepo.update).toHaveBeenCalledWith('post_1', {
      post_status: 'archived',
      post_date: existingDate,
    });
  });
});

describe('contadores', () => {
  it('countPosts delega en el repositorio', async () => {
    mockedPostRepo.count.mockResolvedValue(7);

    await expect(countPosts()).resolves.toBe(7);
  });

  it('countPostsByStatus delega en el repositorio', async () => {
    mockedPostRepo.countByStatus.mockResolvedValue(2);

    await expect(countPostsByStatus('draft')).resolves.toBe(2);
    expect(mockedPostRepo.countByStatus).toHaveBeenCalledWith('draft');
  });
});

describe('getPublishedPostByName', () => {
  it('delega en findPublishedByName con el slug', async () => {
    const post = makePost({ post_status: 'published', post_name: 'mi-pagina' });
    mockedPostRepo.findPublishedByName.mockResolvedValue(post);

    await expect(getPublishedPostByName('mi-pagina')).resolves.toBe(post);
    expect(mockedPostRepo.findPublishedByName).toHaveBeenCalledWith('mi-pagina');
  });

  it('devuelve null si no hay post publicado con ese slug', async () => {
    mockedPostRepo.findPublishedByName.mockResolvedValue(null);

    await expect(getPublishedPostByName('inexistente')).resolves.toBeNull();
  });
});

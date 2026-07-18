import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const fsPromises = { unlink: jest.fn() };
jest.unstable_mockModule('fs/promises', () => ({ default: fsPromises }));

const {
  deleteStoredImage,
  deleteStoredImages,
  cleanupReplacedImages,
  cleanupResourceImages
} = await import('../../src/utils/imageLifecycle.js');
const { cleanupRequestFiles } = await import('../../src/utils/fileCleanup.js');

beforeEach(() => {
  jest.clearAllMocks();
  fsPromises.unlink.mockReset().mockResolvedValue(undefined);
});

describe('imageLifecycle', () => {
  test.each([null, undefined, 12, '', 'https://cdn.test/a.jpg', '/otro/a.jpg', '/uploads/', '/uploads/../secreto.txt'])('ignora ruta no local o insegura %#', async (value) => {
    await expect(deleteStoredImage(value)).resolves.toBe(false);
    expect(fsPromises.unlink).not.toHaveBeenCalled();
  });

  test('elimina una imagen local valida ignorando query y hash', async () => {
    await expect(deleteStoredImage('/uploads/departamentos/a.jpg?x=1#foto')).resolves.toBe(true);
    expect(fsPromises.unlink).toHaveBeenCalledTimes(1);
    expect(fsPromises.unlink.mock.calls[0][0]).toMatch(/uploads[\\/]departamentos[\\/]a\.jpg$/);
  });

  test('tolera archivo inexistente', async () => {
    fsPromises.unlink.mockRejectedValue(Object.assign(new Error('missing'), { code: 'ENOENT' }));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(deleteStoredImage('/uploads/a.jpg')).resolves.toBe(false);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('registra error distinto de ENOENT sin propagarlo', async () => {
    fsPromises.unlink.mockRejectedValue(Object.assign(new Error('denied'), { code: 'EACCES' }));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(deleteStoredImage('/uploads/a.jpg')).resolves.toBe(false);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('elimina rutas unicas y omite valores vacios', async () => {
    await deleteStoredImages(['/uploads/a.jpg', '/uploads/a.jpg', null, '/uploads/b.jpg']);
    expect(fsPromises.unlink).toHaveBeenCalledTimes(2);
  });

  test('limpia solo imagenes reemplazadas', async () => {
    await cleanupReplacedImages(
      { imagen: '/uploads/anterior.jpg', imagen_2: '/uploads/igual.jpg', imagen_3: null },
      { imagen: '/uploads/nueva.jpg', imagen_2: '/uploads/igual.jpg', imagen_3: '/uploads/otra.jpg' },
      ['imagen', 'imagen_2', 'imagen_3']
    );
    expect(fsPromises.unlink).toHaveBeenCalledTimes(1);
    expect(fsPromises.unlink.mock.calls[0][0]).toMatch(/anterior\.jpg$/);
  });

  test('limpia todas las imagenes asociadas a un recurso', async () => {
    await cleanupResourceImages({ imagen: '/uploads/a.jpg', imagen_2: '/uploads/b.jpg' }, ['imagen', 'imagen_2']);
    expect(fsPromises.unlink).toHaveBeenCalledTimes(2);
  });
});

describe('fileCleanup.cleanupRequestFiles', () => {
  test('limpia req.file', async () => {
    await cleanupRequestFiles({ file: { path: 'tmp/a.jpg' } });
    expect(fsPromises.unlink).toHaveBeenCalledWith('tmp/a.jpg');
  });

  test('limpia req.files como arreglo', async () => {
    await cleanupRequestFiles({ files: [{ path: 'tmp/a.jpg' }, { path: 'tmp/b.jpg' }, {}] });
    expect(fsPromises.unlink).toHaveBeenCalledTimes(2);
  });

  test('limpia req.files agrupados por campo', async () => {
    await cleanupRequestFiles({ files: { imagen: [{ path: 'tmp/a.jpg' }], imagen_2: [{ path: 'tmp/b.jpg' }] } });
    expect(fsPromises.unlink).toHaveBeenCalledTimes(2);
  });

  test('tolera ENOENT y registra otros errores', async () => {
    fsPromises.unlink
      .mockRejectedValueOnce(Object.assign(new Error('missing'), { code: 'ENOENT' }))
      .mockRejectedValueOnce(Object.assign(new Error('denied'), { code: 'EACCES' }));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await cleanupRequestFiles({ files: [{ path: 'tmp/a.jpg' }, { path: 'tmp/b.jpg' }] });
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  test('acepta solicitud vacia', async () => {
    await cleanupRequestFiles(undefined);
    expect(fsPromises.unlink).not.toHaveBeenCalled();
  });
});

import { describe, expect, jest, test } from '@jest/globals';
import { getUploadedFileUrl } from '../../src/utils/uploadedFile.js';
import { getCloudinaryPublicIdFromUrl } from '../../src/services/cloudinaryService.js';
import {
  persistUploadedImages,
  verifyUploadedImageSignatures
} from '../../src/middlewares/uploadMiddleware.js';

describe('getUploadedFileUrl', () => {
  test('prioriza storageUrl de Cloudinary', () => {
    expect(getUploadedFileUrl({
      storageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/peru-app/a.webp',
      filename: 'a.webp'
    }, 'departamentos')).toBe('https://res.cloudinary.com/demo/image/upload/v1/peru-app/a.webp');
  });

  test('mantiene compatibilidad con almacenamiento local', () => {
    expect(getUploadedFileUrl({ filename: 'a.webp' }, 'departamentos'))
      .toBe('/uploads/departamentos/a.webp');
  });

  test('acepta URL HTTPS en file.path', () => {
    expect(getUploadedFileUrl({ path: 'https://cdn.test/a.webp' }, 'departamentos'))
      .toBe('https://cdn.test/a.webp');
  });

  test('devuelve null sin archivo', () => {
    expect(getUploadedFileUrl(null, 'departamentos')).toBeNull();
  });
});

describe('getCloudinaryPublicIdFromUrl', () => {
  test('extrae public_id de URL segura', () => {
    expect(getCloudinaryPublicIdFromUrl(
      'https://res.cloudinary.com/demo/image/upload/v123/peru-app/production/departamentos/foto.webp'
    )).toBe('peru-app/production/departamentos/foto');
  });

  test('tolera transformaciones antes de la version', () => {
    expect(getCloudinaryPublicIdFromUrl(
      'https://res.cloudinary.com/demo/image/upload/c_fill,w_500/v123/peru-app/foto.jpg'
    )).toBe('peru-app/foto');
  });

  test.each([null, '', 'https://cdn.test/foto.jpg', '/uploads/foto.jpg'])('ignora URL ajena %#', (value) => {
    expect(getCloudinaryPublicIdFromUrl(value)).toBeNull();
  });
});

describe('middleware de almacenamiento local compatible', () => {
  test('valida firma desde memoria', async () => {
    const req = {
      file: {
        buffer: Buffer.from([0xff, 0xd8, 0xff, 0x00]),
        mimetype: 'image/jpeg'
      }
    };
    const next = jest.fn();

    await verifyUploadedImageSignatures(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('asigna URL local cuando IMAGE_STORAGE es local', async () => {
    const req = {
      file: {
        storageFolder: 'departamentos',
        filename: 'foto.webp'
      }
    };
    const next = jest.fn();

    await persistUploadedImages(req, {}, next);
    expect(req.file.storageUrl).toBe('/uploads/departamentos/foto.webp');
    expect(next).toHaveBeenCalledWith();
  });
});

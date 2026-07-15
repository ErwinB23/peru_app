import fs from 'fs/promises';
import path from 'path';
import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import { verifyUploadedImageSignatures } from '../../src/middlewares/uploadMiddleware.js';

const tempDir = path.join(process.cwd(), 'uploads', '__qa_signature_tests__');

const write = async (name, bytes) => {
  const filePath = path.join(tempDir, name);
  await fs.writeFile(filePath, Buffer.from(bytes));
  return filePath;
};

beforeAll(async () => {
  await fs.mkdir(tempDir, { recursive: true });
});

afterAll(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});

const execute = async (req) => {
  const next = jest.fn();
  await verifyUploadedImageSignatures(req, {}, next);
  return next;
};

describe('verifyUploadedImageSignatures', () => {
  test('continua cuando no hay archivos', async () => {
    const next = await execute({});
    expect(next).toHaveBeenCalledWith();
  });

  test('acepta firma JPEG valida en req.file', async () => {
    const filePath = await write('ok.jpg', [0xff, 0xd8, 0xff, 0x00, 0x00]);
    const next = await execute({ file: { path: filePath, mimetype: 'image/jpeg' } });
    expect(next).toHaveBeenCalledWith();
  });

  test('acepta firma PNG valida en req.files agrupado', async () => {
    const filePath = await write('ok.png', [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);
    const next = await execute({ files: { imagen: [{ path: filePath, mimetype: 'image/png' }] } });
    expect(next).toHaveBeenCalledWith();
  });

  test('acepta firma WEBP valida en arreglo', async () => {
    const bytes = Buffer.alloc(16);
    bytes.write('RIFF', 0, 'ascii');
    bytes.write('WEBP', 8, 'ascii');
    const filePath = path.join(tempDir, 'ok.webp');
    await fs.writeFile(filePath, bytes);
    const next = await execute({ files: [{ path: filePath, mimetype: 'image/webp' }] });
    expect(next).toHaveBeenCalledWith();
  });

  test('rechaza archivo cuya firma no coincide con MIME', async () => {
    const filePath = await write('fake.jpg', [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const next = await execute({ file: { path: filePath, mimetype: 'image/jpeg' } });
    const error = next.mock.calls[0][0];
    expect(error.status).toBe(415);
    expect(error.code).toBe('INVALID_IMAGE_SIGNATURE');
  });

  test('rechaza contenido desconocido', async () => {
    const filePath = await write('fake.bin', [1, 2, 3, 4, 5]);
    const next = await execute({ file: { path: filePath, mimetype: 'image/png' } });
    expect(next.mock.calls[0][0].status).toBe(415);
  });

  test('propaga error cuando el archivo no puede abrirse', async () => {
    const next = await execute({ file: { path: path.join(tempDir, 'no-existe.jpg'), mimetype: 'image/jpeg' } });
    expect(next.mock.calls[0][0]).toEqual(expect.objectContaining({ code: 'ENOENT' }));
  });
});

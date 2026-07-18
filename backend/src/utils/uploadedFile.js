export const getUploadedFileUrl = (file, fallbackFolder) => {
  if (!file) {
    return null;
  }

  if (typeof file.storageUrl === 'string' && file.storageUrl.trim() !== '') {
    return file.storageUrl;
  }

  if (typeof file.path === 'string' && /^https?:\/\//i.test(file.path)) {
    return file.path;
  }

  if (file.filename && fallbackFolder) {
    return `/uploads/${fallbackFolder}/${file.filename}`;
  }

  return null;
};

import type { MenuImageData } from '../../context/MenuManageModalContext';

export const getImageUrl = (image: MenuImageData | null): string | null => {
  if (!image) return null;
  return image.file
    ? URL.createObjectURL(image.file)
    : (image.imagePath ?? null);
};

export const getFileExtension = (src: string, mimeType?: string) => {
  if (mimeType) {
    const normalized = mimeType.toLowerCase();
    if (normalized === 'image/png') return '.png';
    if (normalized === 'image/webp') return '.webp';
    if (normalized === 'image/heic') return '.heic';
    if (normalized === 'image/heif') return '.heif';
    if (normalized === 'image/jpeg') return '.jpg';
  }

  const match = src.match(/\.(\w+)(?:$|\?)/);
  if (match?.[1]) {
    return `.${match[1]}`;
  }

  return '.jpg';
};

export const toCameraFile = async (src: string): Promise<File | null> => {
  try {
    const response = await fetch(src);
    if (!response.ok) {
      return null;
    }
    const blob = await response.blob();
    const ext = getFileExtension(src, blob.type);
    return new File([blob], `camera-${Date.now()}${ext}`, {
      type: blob.type || 'image/jpeg',
    });
  } catch {
    return null;
  }
};

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { IMenu, IMenuImage, ICreateMenuImage } from '@repo/api/types';
import type { MenuImageData, ModalMode } from './types';
import {
  createMenuImageData,
  toExistingImageData,
  createFileForUpload,
  isExistingImage,
  parseImageSeq,
} from './utils';

interface Props {
  menu?: IMenu;
  mode: ModalMode;
}

export const useMenuImagesState = ({ menu, mode }: Props) => {
  const [mainImageData, setMainImageData] = useState<MenuImageData | null>(
    null
  );
  const [additionalImagesData, setAdditionalImagesData] = useState<
    MenuImageData[]
  >([]);
  const [deletedImageIds, setDeletedImageIds] = useState<Set<number>>(
    new Set()
  );
  const [originalImagesMap, setOriginalImagesMap] = useState<
    Map<number, IMenuImage>
  >(new Map());

  useEffect(() => {
    if (mode !== 'edit' || !menu?.menuImageList) return;

    const validImages = menu.menuImageList.filter(
      (img) => !img.isDeleted && img.imagePath
    );
    setOriginalImagesMap(
      new Map(menu.menuImageList.map((img) => [img.imageSeq, img]))
    );

    const mainImg = validImages.find((img) => img.isMainImage);
    setMainImageData(mainImg ? toExistingImageData(mainImg, true) : null);
    setAdditionalImagesData(
      validImages
        .filter((img) => !img.isMainImage)
        .map((img) => toExistingImageData(img, false))
    );
  }, [mode, menu]);

  const isNotDeleted = useCallback(
    (img: MenuImageData) => {
      if (typeof img.imageSeq === 'number') {
        return !deletedImageIds.has(img.imageSeq);
      }
      return true;
    },
    [deletedImageIds]
  );

  const mainImage = useMemo(
    () => (mainImageData && isNotDeleted(mainImageData) ? mainImageData : null),
    [mainImageData, isNotDeleted]
  );

  const additionalImages = useMemo(
    () => additionalImagesData.filter(isNotDeleted),
    [additionalImagesData, isNotDeleted]
  );

  // 기존 서버 이미지에 대해서만 삭제 플래그를 기록한다.
  const markAsDeleted = useCallback((id: string) => {
    if (isExistingImage(id)) {
      setDeletedImageIds((prev) => new Set(prev).add(parseImageSeq(id)));
    }
  }, []);

  const restoreDeletedImage = useCallback((imageSeq: number) => {
    setDeletedImageIds((prev) => {
      if (!prev.has(imageSeq)) {
        return prev;
      }
      const next = new Set(prev);
      next.delete(imageSeq);
      return next;
    });
  }, []);

  // 메인 이미지를 교체할 때 기존 메인은 삭제 처리 후 새 파일로 교체한다.
  const setMainImage = useCallback(
    (file: File) => {
      setMainImageData((prev) => {
        if (prev) {
          markAsDeleted(prev.id);
        }
        return createMenuImageData(file, true);
      });
    },
    [markAsDeleted]
  );

  const setMainExistingImage = useCallback(
    (image: MenuImageData) => {
      setMainImageData((prev) => {
        if (prev?.id === image.id) {
          return prev;
        }
        if (prev) {
          markAsDeleted(prev.id);
        }
        return { ...image, isMainImage: true };
      });

      setAdditionalImagesData((prev) =>
        prev.filter((img) => img.id !== image.id)
      );

      if (typeof image.imageSeq === 'number') {
        restoreDeletedImage(image.imageSeq);
      }
    },
    [markAsDeleted, restoreDeletedImage]
  );

  const removeMainImage = useCallback(() => {
    if (!mainImageData) return;
    markAsDeleted(mainImageData.id);
    setMainImageData(null);
  }, [mainImageData, markAsDeleted]);

  const addAdditionalImages = useCallback((files: FileList | File[]) => {
    const newImages = Array.from(files).map((file) =>
      createMenuImageData(file, false)
    );
    setAdditionalImagesData((prev) => [...prev, ...newImages]);
  }, []);

  const addExistingImages = useCallback(
    (images: MenuImageData[]) => {
      setAdditionalImagesData((prev) => {
        const existingIds = new Set<string>();
        if (mainImageData) {
          existingIds.add(mainImageData.id);
        }
        prev.forEach((img) => existingIds.add(img.id));

        const newImages = images
          .filter((img) => !existingIds.has(img.id))
          .map((img) => ({ ...img, isMainImage: false }));

        return [...prev, ...newImages];
      });

      setDeletedImageIds((prev) => {
        const next = new Set(prev);
        images.forEach((img) => {
          if (typeof img.imageSeq === 'number') {
            next.delete(img.imageSeq);
          }
        });
        return next;
      });
    },
    [mainImageData]
  );

  const removeAdditionalImage = useCallback(
    (id: string) => {
      if (isExistingImage(id)) {
        markAsDeleted(id);
      }
      setAdditionalImagesData((prev) => prev.filter((img) => img.id !== id));
    },
    [markAsDeleted]
  );

  const replaceAdditionalImage = useCallback(
    (id: string, file: File) => {
      setAdditionalImagesData((prev) => {
        const targetIndex = prev.findIndex((img) => img.id === id);
        const nextImage = createMenuImageData(file, false);

        if (targetIndex < 0) {
          return [...prev, nextImage];
        }

        const next = [...prev];
        if (isExistingImage(id)) {
          markAsDeleted(id);
        }
        next.splice(targetIndex, 1, nextImage);
        return next;
      });
    },
    [markAsDeleted]
  );

  /** 모든 활성 이미지 (mainImage + additionalImages) 반환 */
  const getAllActiveImages = useCallback(
    () => [mainImage, ...additionalImages].filter(Boolean) as MenuImageData[],
    [mainImage, additionalImages]
  );

  const getMenuImageList = useCallback((): ICreateMenuImage[] => {
    return getAllActiveImages().map((img, index) => ({
      imageName:
        img.file?.id || img.imageName || `existing-${img.imageSeq ?? index}`,
      imageIndex: index,
      isMainImage: img.isMainImage,
      // imageSeq는 POST에서도 0으로 내려 보낸다(기존/추천 이미지는 파일 없이 사용).
      imageSeq: img.imageSeq ?? 0,
      imagePath: img.imagePath ?? null,
      imageExtension: img.imageExtension ?? null,
    }));
  }, [getAllActiveImages]);

  const getUpdateMenuImageList = useCallback(
    (menuSeq: number): IMenuImage[] => {
      let imageIndex = 0;

      const activeImageList = getAllActiveImages().map((img): IMenuImage => {
        const originalImage = img.imageSeq
          ? originalImagesMap.get(img.imageSeq)
          : null;
        const fallbackImageName = img.imageSeq
          ? `existing-${img.imageSeq}`
          : '';

        return {
          imageSeq: img.imageSeq ?? 0,
          menuSeq,
          imagePath: originalImage?.imagePath ?? img.imagePath ?? null,
          imageName:
            img.file?.id ||
            originalImage?.imageName ||
            img.imageName ||
            fallbackImageName,
          imageExtension:
            originalImage?.imageExtension ?? img.imageExtension ?? null,
          imageIndex: imageIndex++,
          isDeleted: false,
          isMainImage: img.isMainImage,
        };
      });

      // 삭제된 기존 이미지는 isDeleted만 true로 보내고 파일 업로드 목록에서는 제외한다.
      const deletedImageList = Array.from(deletedImageIds)
        .map((imageSeq): IMenuImage | null => {
          const originalImage = originalImagesMap.get(imageSeq);
          if (!originalImage) return null;

          return {
            imageSeq,
            menuSeq,
            imagePath: originalImage.imagePath,
            imageName: originalImage.imageName,
            imageExtension: originalImage.imageExtension,
            imageIndex: originalImage.imageIndex,
            isDeleted: true,
            isMainImage: originalImage.isMainImage,
          };
        })
        .filter(Boolean) as IMenuImage[];

      return [...activeImageList, ...deletedImageList];
    },
    [getAllActiveImages, deletedImageIds, originalImagesMap]
  );

  const getFiles = useCallback((): File[] => {
    return getAllActiveImages()
      .filter((img) => img.file)
      .map((img) => createFileForUpload(img.file!));
  }, [getAllActiveImages]);

  return useMemo(
    () => ({
      mainImage,
      additionalImages,
      setMainImage,
      setMainExistingImage,
      removeMainImage,
      addAdditionalImages,
      addExistingImages,
      removeAdditionalImage,
      replaceAdditionalImage,
      getMenuImageList,
      getUpdateMenuImageList,
      getFiles,
    }),
    [
      mainImage,
      additionalImages,
      setMainImage,
      setMainExistingImage,
      removeMainImage,
      addAdditionalImages,
      addExistingImages,
      removeAdditionalImage,
      replaceAdditionalImage,
      getMenuImageList,
      getUpdateMenuImageList,
      getFiles,
    ]
  );
};

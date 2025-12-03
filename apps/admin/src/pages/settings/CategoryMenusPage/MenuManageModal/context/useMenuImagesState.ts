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

  const removeAdditionalImage = useCallback(
    (id: string) => {
      if (isExistingImage(id)) {
        markAsDeleted(id);
      } else {
        setAdditionalImagesData((prev) => prev.filter((img) => img.id !== id));
      }
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
      imageName: img.file?.id || `existing-${img.imageSeq}`,
      imageIndex: index,
      isMainImage: img.isMainImage,
    }));
  }, [getAllActiveImages]);

  const getUpdateMenuImageList = useCallback(
    (menuSeq: number): IMenuImage[] => {
      let imageIndex = 0;

      const activeImageList = getAllActiveImages().map((img): IMenuImage => {
        const originalImage = img.imageSeq
          ? originalImagesMap.get(img.imageSeq)
          : null;

        return {
          imageSeq: img.imageSeq ?? 0,
          menuSeq,
          imagePath: originalImage?.imagePath ?? null,
          imageName: img.file?.id || originalImage?.imageName || '',
          imageExtension: originalImage?.imageExtension ?? null,
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
      removeMainImage,
      addAdditionalImages,
      removeAdditionalImage,
      getMenuImageList,
      getUpdateMenuImageList,
      getFiles,
    }),
    [
      mainImage,
      additionalImages,
      setMainImage,
      removeMainImage,
      addAdditionalImages,
      removeAdditionalImage,
      getMenuImageList,
      getUpdateMenuImageList,
      getFiles,
    ]
  );
};

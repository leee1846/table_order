import { t } from '@/config/i18n';
import { useCallback, useRef, useState, type ChangeEvent } from 'react';
import { theme } from '@repo/ui';
import {
  AddIcon,
  CloseIcon,
  PhotoIcon,
  bestOnIcon,
  newOnIcon,
  spicyLevel1Icon,
  spicyLevel2Icon,
  spicyLevel3Icon,
} from '@repo/ui/icons';
import { CameraManager, CapacitorApp, type AlbumPhoto } from '@repo/util/app';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting/ImageSection/imageSection.style';
import { AddImageModal } from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting/AddImageModal';
import { ExistingImageModal } from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting/AddImageModal/ExistingImageModal';
import { RecommendedImageModal } from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting/AddImageModal/RecommendedImageModal';
import {
  useMenuForm,
  useMenuImages,
  type MenuImageData,
} from '@/pages/settings/CategoryMenusPage/MenuManageModal/context/MenuManageModalContext';
import { BasicButton } from '@repo/ui/components';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@repo/feature/utils';
import {
  useGetExistingMenuImageList,
  useGetSampleMenuImageList,
} from '@repo/api/queries';
import type {
  IExistingMenuImage,
  ISampleMenuImage,
  ISampleMenuImageListResponse,
} from '@repo/api/types';
import { GalleryModal } from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting/ImageSection/GalleryModal';
import {
  getImageUrl,
  toCameraFile,
} from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting/ImageSection/imageHelpers';

type ImageModalMode = 'main' | 'additional';
type CaptureTarget = {
  mode: ImageModalMode;
  imageId?: string;
};

const GALLERY_PAGE_LIMIT = 21;

const SPICE_LEVEL_ICONS: Record<number, string> = {
  1: spicyLevel1Icon,
  2: spicyLevel2Icon,
  3: spicyLevel3Icon,
};

export const ImageSection = () => {
  // 파일 입력 요소 참조
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 이미지 추가 모달 열림 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 기존 이미지 선택 모달 열림 상태
  const [isExistingModalOpen, setIsExistingModalOpen] = useState(false);
  // 추천 이미지 선택 모달 열림 상태
  const [isRecommendedModalOpen, setIsRecommendedModalOpen] = useState(false);
  // 기존 이미지 목록 (매장에 저장된 이미지 목록)
  const [existingImages, setExistingImages] = useState<IExistingMenuImage[]>(
    []
  );

  // 추천 이미지 목록 (샘플 메뉴 이미지 목록)
  const [recommendedImages, setRecommendedImages] = useState<
    ISampleMenuImageListResponse[]
  >([]);
  // 이미지 모달 모드 ('main': 메인 이미지, 'additional': 추가 이미지)
  const [modalMode, setModalMode] = useState<ImageModalMode>('main');
  // 캡처 대상 정보 참조 (이미지를 어디에 추가할지 결정하는 정보: mode, imageId)
  const captureTargetRef = useRef<CaptureTarget | null>(null);
  // 갤러리 모달 열림 상태 (네이티브 앱의 앨범에서 이미지 선택)
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  // 앨범 아이템 목록 (갤러리에서 로드한 사진 목록)
  const [albumItems, setAlbumItems] = useState<AlbumPhoto[]>([]);
  // 앨범 페이지 번호 (페이지네이션용, 0부터 시작)
  const [albumPage, setAlbumPage] = useState(0);
  // 더 많은 앨범 아이템이 있는지 여부 (페이지네이션 종료 여부)
  const [hasMoreAlbum, setHasMoreAlbum] = useState(true);
  // 앨범 로딩 중 여부 (갤러리에서 이미지 목록을 불러오는 중)
  const [isAlbumLoading, setIsAlbumLoading] = useState(false);
  // 앨범 업로드 중 여부 (선택한 이미지를 변환하고 적용하는 중)
  const [isAlbumUploading, setIsAlbumUploading] = useState(false);
  // 선택된 앨범 URI 집합 (갤러리에서 사용자가 선택한 이미지들의 URI)
  const [selectedAlbumUris, setSelectedAlbumUris] = useState<Set<string>>(
    new Set()
  );

  const { shopCode } = useAuth();

  const { formValues } = useMenuForm();
  const {
    mainImage,
    additionalImages,
    setMainImage,
    setMainExistingImage,
    removeMainImage,
    addAdditionalImages,
    addExistingImages,
    removeAdditionalImage,
    replaceAdditionalImage,
  } = useMenuImages();

  //기존 이미지
  const { refetch: refetchExistingImages } = useGetExistingMenuImageList(
    shopCode ?? '',
    {
      enabled: false,
    }
  );

  //추천 이미지
  const { data: recommendedImagesData } = useGetSampleMenuImageList();

  const mainImageUrl = getImageUrl(mainImage);
  const isNativeApp = CapacitorApp.isNative();

  // Flow: 1) 이미지 소스 선택(AddImageModal) → 2) 파일/원본 준비 → 3) main/additional에 배치 → 4) 상위 컨텍스트에서 업로드 조립
  // 이미지 추가 모달 열기
  const openModal = useCallback((mode: ImageModalMode, imageId?: string) => {
    captureTargetRef.current =
      mode === 'main' || imageId ? { mode, imageId } : null;
    setModalMode(mode);
    setIsModalOpen(true);
  }, []);

  // 캡처 대상 정보 초기화
  const resetCaptureTarget = useCallback(() => {
    captureTargetRef.current = null;
  }, []);

  // 캡처 대상 정보 결정 (target 우선, 없으면 ref 또는 modalMode 사용)
  const resolveTarget = useCallback(
    (target?: CaptureTarget | null): CaptureTarget => {
      return (
        target ??
        captureTargetRef.current ?? {
          mode: modalMode,
        }
      );
    },
    [modalMode]
  );

  // 선택된 파일을 목표 위치에 분배 (main 우선, 나머지는 additional)
  const applyFilesToTarget = useCallback(
    (files: File[], target?: CaptureTarget | null) => {
      if (files.length === 0) {
        return;
      }

      const [primary, ...rest] = files;
      if (!primary) {
        return;
      }

      const resolvedTarget = resolveTarget(target);

      if (resolvedTarget.mode === 'main') {
        setMainImage(primary);
        if (rest.length) {
          addAdditionalImages(rest);
        }
        return;
      }

      if (resolvedTarget.mode === 'additional' && resolvedTarget.imageId) {
        replaceAdditionalImage(resolvedTarget.imageId, primary);
        if (rest.length) {
          addAdditionalImages(rest);
        }
        return;
      }

      if (modalMode === 'main') {
        setMainImage(primary);
        if (rest.length) {
          addAdditionalImages(rest);
        }
        return;
      }

      addAdditionalImages(files);
    },
    [
      addAdditionalImages,
      modalMode,
      replaceAdditionalImage,
      resolveTarget,
      setMainImage,
    ]
  );

  // 촬영 결과 처리
  const handleCaptureResult = useCallback(
    (file: File | null, target?: CaptureTarget | null) => {
      if (file) {
        applyFilesToTarget([file], target);
      }
      resetCaptureTarget();
    },
    [applyFilesToTarget, resetCaptureTarget]
  );

  // 갤러리에서 선택한 파일 적용
  const applyGalleryFiles = useCallback(
    (files: File[], target?: CaptureTarget | null) => {
      if (files.length === 0) {
        return;
      }
      applyFilesToTarget(files, target);
      resetCaptureTarget();
    },
    [applyFilesToTarget, resetCaptureTarget]
  );

  // 파일 입력 변경 처리
  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (!files.length) {
        return;
      }

      applyFilesToTarget(files, captureTargetRef.current);

      // 선택한 파일 초기화
      resetCaptureTarget();

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [applyFilesToTarget, resetCaptureTarget]
  );

  // 갤러리 상태 초기화
  const resetGalleryState = useCallback(() => {
    setAlbumItems([]);
    setAlbumPage(0);
    setHasMoreAlbum(true);
    setSelectedAlbumUris(new Set());
    setIsAlbumLoading(false);
    setIsAlbumUploading(false);
  }, []);

  // 앨범 페이지 로드
  // 네이티브 앱의 갤러리에서 특정 페이지의 이미지 목록을 불러와서 상태에 추가하는 함수
  const loadAlbumPage = useCallback(
    async (page: number) => {
      // 이미 로딩 중이면 중복 호출 방지
      if (isAlbumLoading) {
        return;
      }
      setIsAlbumLoading(true);
      try {
        // CameraManager를 통해 해당 페이지의 이미지 목록을 가져옴 (페이지 번호, 페이지당 개수)
        const images = await CameraManager.loadAlbum(page, GALLERY_PAGE_LIMIT);
        // 응답이 배열이 아니면 빈 배열로 처리
        const newItems = Array.isArray(images) ? images : [];

        // 가져온 이미지들을 기존 목록에 추가 (중복 방지)
        setAlbumItems((prev) => {
          // 기존 목록의 모든 originalUri를 Set으로 만들어 중복 체크용으로 사용
          const existing = new Set(prev.map((item) => item.path));
          // 첫 페이지(page === 0)면 기존 목록을 초기화하고, 아니면 기존 목록을 유지
          const base = page === 0 ? [] : [...prev];
          // 새로 가져온 이미지들 중에서 중복되지 않은 것만 추가
          newItems.forEach((item) => {
            if (!existing.has(item.path)) {
              base.push(item);
            }
          });
          return base;
        });

        // 현재 페이지 번호 업데이트
        setAlbumPage(page);
        // 가져온 이미지가 없거나 페이지 제한보다 적으면 더 이상 불러올 이미지가 없음
        if (!newItems.length) {
          setHasMoreAlbum(false);
        }
      } catch (error) {
        console.error('Album load error:', error);
        toast(t('갤러리를 불러오지 못했습니다.'));
        // 에러 발생 시 더 이상 불러올 이미지가 없다고 표시하여 무한 로딩 방지
        setHasMoreAlbum(false);
      }
      // 로딩 상태 해제
      setIsAlbumLoading(false);
    },
    [isAlbumLoading]
  );

  // 갤러리에서 선택 (네이티브: 갤러리 모달, 웹: 파일 입력)
  const handleSelectFromGallery = useCallback(() => {
    const isNative = CapacitorApp.isNative();
    if (!isNative) {
      fileInputRef.current?.click();
      return;
    }

    (async () => {
      resetGalleryState();
      setIsGalleryModalOpen(true);
      await loadAlbumPage(0);
    })();
  }, [loadAlbumPage, resetGalleryState]);

  // 앨범 더 불러오기
  const handleLoadMoreAlbum = useCallback(() => {
    if (!hasMoreAlbum || isAlbumLoading) {
      return;
    }
    loadAlbumPage(albumPage + 1);
  }, [albumPage, hasMoreAlbum, isAlbumLoading, loadAlbumPage]);

  // 앨범 이미지 선택 토글
  const handleToggleAlbumSelection = useCallback((originalUri: string) => {
    setSelectedAlbumUris((prev) => {
      const next = new Set(prev);
      if (next.has(originalUri)) {
        next.delete(originalUri);
      } else {
        next.add(originalUri);
      }
      return next;
    });
  }, []);

  // 갤러리 선택 확인 및 적용
  const handleConfirmGallerySelection = useCallback(async () => {
    if (selectedAlbumUris.size === 0) {
      toast(t('이미지를 선택해주세요.'));
      return;
    }

    if (!isNativeApp) {
      toast(t('네이티브 앱에서만 갤러리를 사용할 수 있습니다.'));
      return;
    }

    const target = captureTargetRef.current;
    setIsAlbumUploading(true);
    try {
      const uris = Array.from(selectedAlbumUris);

      if (uris.length > 0) {
        // 원본 파일 준비(getOriginalFile)는 최종 확인 시에만 호출해 네이티브 호출을 최소화한다.
        const preparedPaths = await Promise.all(
          uris.map(async (uri) => {
            const result = await CameraManager.getOriginalFile(uri);
            return result ?? null;
          })
        );

        const files: File[] = [];
        for (const path of preparedPaths) {
          if (!path) {
            continue;
          }
          const file = await toCameraFile(path);
          if (file) {
            files.push(file);
          }
        }

        if (files.length === 0) {
          toast(t('선택한 이미지를 불러오지 못했습니다.'));
          return;
        }

        applyGalleryFiles(files, target);
        setIsGalleryModalOpen(false);
        resetGalleryState();
      }

      try {
        await CameraManager.clearCache();
      } catch (error) {
        console.warn('Failed to clear cache after upload:', error);
      }
    } catch (error) {
      console.error('Gallery upload error:', error);
      toast(t('이미지 업로드에 실패했습니다.'));
    }
    setIsAlbumUploading(false);
  }, [applyGalleryFiles, resetGalleryState, selectedAlbumUris, isNativeApp]);

  // 갤러리 모달 닫기
  const handleCloseGalleryModal = useCallback(() => {
    setIsGalleryModalOpen(false);
    resetGalleryState();
    resetCaptureTarget();
  }, [resetCaptureTarget, resetGalleryState]);

  // 사진 촬영
  const handleTakePhoto = useCallback(async () => {
    if (!isNativeApp) {
      toast(t('네이티브 앱에서만 사진 촬영이 가능합니다.'));
      resetCaptureTarget();
      return;
    }
    const target = captureTargetRef.current;

    try {
      const result = await CameraManager.takePhoto();

      if (!result?.src) {
        handleCaptureResult(null, target);
        return;
      }

      const file = await toCameraFile(result.src);
      if (!file) {
        toast(t('사진을 불러오지 못했습니다.'));
        handleCaptureResult(null, target);
        return;
      }

      handleCaptureResult(file, target);
    } catch (error) {
      console.error('Camera error:', error);
      toast(t('사진 촬영에 실패했습니다.'));
      resetCaptureTarget();
    }
  }, [handleCaptureResult, isNativeApp, resetCaptureTarget]);

  // 기존 이미지 사용 모달 열기
  const handleUseExistingImage = useCallback(async () => {
    if (!shopCode) {
      toast(t('매장 정보를 확인할 수 없습니다.'));
      return;
    }

    const result = await refetchExistingImages();

    if (!result.data?.data) {
      toast(t('기존 이미지 목록을 불러오지 못했습니다.'));
      return;
    }

    setExistingImages(result.data.data);
    setIsExistingModalOpen(true);
  }, [shopCode, refetchExistingImages]);

  // 추천 이미지 사용 모달 열기
  const handleUseRecommendedImage = useCallback(async () => {
    if (!recommendedImagesData?.data) {
      toast(t('추천 이미지 목록을 불러오지 못했습니다.'));
      return;
    }

    const data = recommendedImagesData.data;
    // API 응답이 이미 배열이면 그대로, 단일 객체면 배열로 변환해 전달
    setRecommendedImages(Array.isArray(data) ? data : [data]);
    setIsRecommendedModalOpen(true);
  }, [recommendedImagesData]);

  // 기존 이미지를 MenuImageData로 변환
  const toExistingMenuImageData = useCallback(
    (image: IExistingMenuImage, isMainImage: boolean): MenuImageData => ({
      // Treat library images as new uploads for payload purposes.
      id: `existing-library-${image.imageSeq}`,
      imagePath: image.imagePath ?? undefined,
      imageSeq: 0,
      imageName: image.imageName,
      imageExtension: image.imageExtension ?? null,
      isMainImage,
    }),
    []
  );
  // 샘플 이미지를 MenuImageData로 변환
  const toSampleMenuImageData = useCallback(
    (image: ISampleMenuImage, isMainImage: boolean): MenuImageData => ({
      id: `sample-${image.menuImageSampleSeq}`,
      imagePath: image.imagePath ?? undefined,
      imageSeq: 0,
      imageName: image.imageName,
      imageExtension: null,
      isMainImage,
    }),
    []
  );

  // 기존 이미지 선택 확인 및 적용
  const handleConfirmExistingImages = useCallback(
    (selected: IExistingMenuImage[]) => {
      if (selected.length === 0) {
        setIsExistingModalOpen(false);
        return;
      }

      if (modalMode === 'main') {
        const [mainSelection, ...restSelections] = selected;
        if (mainSelection) {
          setMainExistingImage(toExistingMenuImageData(mainSelection, true));
        }
        if (restSelections.length > 0) {
          addExistingImages(
            restSelections.map((image) => toExistingMenuImageData(image, false))
          );
        }
      } else {
        addExistingImages(
          selected.map((image) => toExistingMenuImageData(image, false))
        );
      }

      setIsExistingModalOpen(false);
    },
    [
      modalMode,
      setMainExistingImage,
      addExistingImages,
      toExistingMenuImageData,
    ]
  );

  // 추천 이미지 선택 확인 및 적용
  const handleConfirmRecommendedImages = useCallback(
    (selected: ISampleMenuImage[]) => {
      if (selected.length === 0) {
        setIsRecommendedModalOpen(false);
        return;
      }

      if (modalMode === 'main') {
        const [mainSelection, ...restSelections] = selected;
        if (mainSelection) {
          setMainExistingImage(toSampleMenuImageData(mainSelection, true));
        }
        if (restSelections.length > 0) {
          addExistingImages(
            restSelections.map((image) => toSampleMenuImageData(image, false))
          );
        }
      } else {
        addExistingImages(
          selected.map((image) => toSampleMenuImageData(image, false))
        );
      }

      setIsRecommendedModalOpen(false);
    },
    [modalMode, setMainExistingImage, addExistingImages, toSampleMenuImageData]
  );

  return (
    <S.Container>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={
          modalMode === 'additional' && !captureTargetRef.current?.imageId
        }
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <S.MainImageTitle>{t('대표 이미지')}</S.MainImageTitle>
      <S.Thumbnail onClick={() => !mainImage && openModal('main')}>
        {(formValues.isBest || formValues.isNew) && (
          <S.BadgesContainer>
            <div>
              {formValues.isNew && <img src={newOnIcon} alt={t('신규')} />}
            </div>
            <div>
              {formValues.isBest && <img src={bestOnIcon} alt={t('베스트')} />}
            </div>
          </S.BadgesContainer>
        )}

        <S.SpiceLevelIndicator
          isVisible={
            !!mainImage &&
            !!mainImageUrl &&
            !!formValues.spiceLevel &&
            formValues.spiceLevel > 0
          }
        >
          <S.SpiceIconWrapper>
            <img
              src={SPICE_LEVEL_ICONS[formValues.spiceLevel || 0]}
              alt={t('매운맛')}
            />
          </S.SpiceIconWrapper>
        </S.SpiceLevelIndicator>

        {mainImage && mainImageUrl ? (
          <>
            <S.ThumbnailActionButtons onClick={(e) => e.stopPropagation()}>
              <BasicButton
                onClick={() => openModal('main')}
                customStyle={S.ThumbnailActionButton}
                variant="Outline_Grey_S"
              >
                {t('변경')}
              </BasicButton>
              <BasicButton
                css={S.ThumbnailActionButton}
                onClick={removeMainImage}
                variant="Solid_Sky_Blue_S"
              >
                {t('삭제')}
              </BasicButton>
            </S.ThumbnailActionButtons>
            <img src={mainImageUrl} alt={t('메인 사진')} />
          </>
        ) : (
          <>
            <PhotoIcon width={36} height={36} color={theme.colors.grey[400]} />

            <S.Text>{t('메인 사진 (1장) 을 선택해 주세요')}</S.Text>
            <S.SubText>{t('(392*280px 권장)')}</S.SubText>
          </>
        )}
      </S.Thumbnail>

      <S.AdditionalImagesTitle>{t('서브 이미지')}</S.AdditionalImagesTitle>
      {additionalImages.length > 0 ? (
        <S.ImagesContainer>
          <S.Gradient />
          <S.ScrollableContent>
            <S.ImageAddButton
              type="button"
              onClick={() => openModal('additional')}
            >
              <AddIcon width={20} height={20} color={theme.colors.grey[600]} />
            </S.ImageAddButton>
            <ul>
              {additionalImages
                .sort((a, b) => (a.imageSeq ?? 0) - (b.imageSeq ?? 0))
                .map((image) => (
                  <li key={image.id}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAdditionalImage(image.id);
                      }}
                    >
                      <CloseIcon
                        width={14}
                        height={14}
                        color={theme.colors.grey[200]}
                      />
                    </button>
                    <img
                      src={getImageUrl(image) ?? ''}
                      alt={t('추가 이미지')}
                      onClick={() => openModal('additional', image.id)}
                      onClickCapture={(e) => e.stopPropagation()}
                    />
                  </li>
                ))}
            </ul>
          </S.ScrollableContent>
        </S.ImagesContainer>
      ) : (
        <S.ImageAddButton type="button" onClick={() => openModal('additional')}>
          <AddIcon width={20} height={20} color={theme.colors.grey[600]} />
          <span>{t('추가할 이미지가 있다면 선택해 주세요')}</span>
        </S.ImageAddButton>
      )}

      <GalleryModal
        isOpen={isGalleryModalOpen}
        items={albumItems}
        selected={selectedAlbumUris}
        isLoading={isAlbumLoading}
        isUploading={isAlbumUploading}
        hasMore={hasMoreAlbum}
        onClose={handleCloseGalleryModal}
        onLoadMore={handleLoadMoreAlbum}
        onToggleSelect={handleToggleAlbumSelection}
        onConfirm={handleConfirmGallerySelection}
      />
      <AddImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectFromGallery={handleSelectFromGallery}
        onTakePhoto={handleTakePhoto}
        onUseExistingImage={handleUseExistingImage}
        onUseRecommendedImage={handleUseRecommendedImage}
      />
      <ExistingImageModal
        isOpen={isExistingModalOpen}
        images={existingImages}
        onClose={() => setIsExistingModalOpen(false)}
        onConfirm={handleConfirmExistingImages}
      />
      <RecommendedImageModal
        isOpen={isRecommendedModalOpen}
        images={recommendedImages}
        onClose={() => setIsRecommendedModalOpen(false)}
        onConfirm={handleConfirmRecommendedImages}
      />
    </S.Container>
  );
};

import { t } from '@/config/i18n';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BasicButton } from '@repo/ui/components';
import {
  queryKeys,
  useGetShopThemePage,
  usePutUpdateShopThemePage,
} from '@repo/api/queries';
import type { IShopPageDetail, TInitPageLayout } from '@repo/api/types';
import { useQueryClient } from '@repo/api/tanstack-query';
import { toast } from '@repo/feature/utils';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/pages/settings/StartScreenLogoPage/Logo';
import { generateId, hasInvalidImageFile } from '@repo/util/string';
import * as S from './startScreenLogoPage.style';
import * as UIStyles from '@repo/ui/styles';

/**
 * 시작 화면 로고 설정 페이지 컴포넌트
 * 현재 레이아웃(LIGHT/DARK/IMAGE)에 맞는 로고 이미지를 표시하고 업데이트
 */
export const StartScreenLogoPage = () => {
  const { shopCode, shopSeq: shopSeqFromAuth } = useAuth();
  const queryClient = useQueryClient();

  // Blob URL 메모리 관리를 위한 ref
  const blobUrlsRef = useRef<Set<string>>(new Set());

  // 현재 선택된 로고 이미지 URL
  const [currentLogoImage, setCurrentLogoImage] = useState<string | null>(null);

  // 현재 선택된 로고 파일 객체
  const [currentLogoFile, setCurrentLogoFile] = useState<File | null>(null);

  const { data, refetch } = useGetShopThemePage(shopCode ?? '', {
    enabled: !!shopCode,
  });

  const { mutateAsync: updateShopThemePage } = usePutUpdateShopThemePage();

  const themePage = data?.data;

  // 현재 레이아웃 타입 (LIGHT/DARK/IMAGE)
  const initPageLayout: TInitPageLayout = themePage?.initPageLayout ?? 'LIGHT';

  // 현재 레이아웃에 맞는 페이지 상세 타입 결정
  // IMAGE는 LIGHT와 동일하게 처리
  const currentPageDetailType = useMemo(() => {
    if (initPageLayout === 'DARK') {
      return 'INIT_DARK';
    }
    return 'INIT_LIGHT'; // LIGHT 또는 IMAGE
  }, [initPageLayout]);

  // 매장 코드 변경 시 상태 초기화 및 Blob URL 정리
  useEffect(() => {
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    blobUrlsRef.current.clear();
    setCurrentLogoImage(null);
    setCurrentLogoFile(null);
  }, [shopCode]);

  // 테마 페이지 데이터 로드 시 현재 레이아웃에 맞는 로고 이미지 설정
  useEffect(() => {
    if (!themePage) {
      return;
    }

    const pageDetails = themePage.shopPageDetailList ?? [];
    const currentDetail = pageDetails.find(
      ({ pageDetailType }) => pageDetailType === currentPageDetailType
    );

    setCurrentLogoImage(currentDetail?.pageDetailImagePath ?? null);
    setCurrentLogoFile(null);
  }, [themePage, currentPageDetailType]);

  // 컴포넌트 언마운트 시 Blob URL 정리
  useEffect(() => {
    const blobUrls = blobUrlsRef.current;
    return () => {
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
      blobUrls.clear();
    };
  }, []);

  // 로고 이미지 변경 핸들러
  const handleLogoChange = useCallback(
    (file: File | null, previewUrl: string | null) => {
      // Blob URL 추적
      if (previewUrl?.startsWith('blob:')) {
        blobUrlsRef.current.add(previewUrl);
      }

      setCurrentLogoImage(previewUrl);
      setCurrentLogoFile(file);
    },
    []
  );

  // 로고 설정 저장 핸들러
  const handleSave = useCallback(async () => {
    if (!shopCode) {
      toast(t('매장 정보가 없습니다. 다시 로그인 후 시도해주세요.'));
      return;
    }

    const shopSeq = themePage?.shopSeq ?? shopSeqFromAuth;

    if (!shopSeq) {
      toast(t('매장 정보를 불러오지 못했습니다.'));
      return;
    }

    if (currentLogoFile && hasInvalidImageFile([currentLogoFile])) {
      toast(t('파일 확장자는 .jpg, .jpeg, .png, .webp 만 지원합니다.'));
      return;
    }

    // 기존 페이지 상세 정보 유지 (업데이트 방식)
    const pageDetails = themePage?.shopPageDetailList ?? [];
    const shopPageDetailList: IShopPageDetail[] = pageDetails.map((detail) => {
      // 현재 편집 중인 레이아웃 타입의 상세 정보인 경우
      if (detail.pageDetailType === currentPageDetailType) {
        // 이미지가 삭제된 경우 (currentLogoFile도 없고 currentLogoImage도 없는 경우)
        if (!currentLogoFile && !currentLogoImage) {
          return {
            ...detail,
            shopSeq,
            pageDetailImagePath: null,
          };
        }
      }
      return {
        ...detail,
        shopSeq,
      };
    });

    // 파일이 변경된 경우에만 파일 업로드 파라미터 생성
    let initLightFile: { file: File; fileName: string } | undefined;
    let initDarkFile: { file: File; fileName: string } | undefined;

    if (currentLogoFile) {
      const imageId = generateId();
      // 파일명에서 확장자 추출 (없으면 기본값 .jpg)
      const fileExtension = currentLogoFile.name.match(/\.([^.]+)$/)?.[0];
      const fileName = `${imageId}${fileExtension}`;
      const fileData = { file: currentLogoFile, fileName };

      // LIGHT 또는 IMAGE 레이아웃일 때는 initLightFile 사용
      if (initPageLayout === 'LIGHT' || initPageLayout === 'IMAGE') {
        initLightFile = fileData;
      }
      // DARK 레이아웃일 때는 initDarkFile 사용
      else if (initPageLayout === 'DARK') {
        initDarkFile = fileData;
      }
    }

    await updateShopThemePage({
      shopCode,
      body: {
        shopSeq,
        initPageLayout,
        orderCompletePageLayout:
          themePage?.orderCompletePageLayout ?? 'DEFAULT',
        shopPageDetailList,
      },
      initLightFile,
      initDarkFile,
    });

    // 캐시 무효화 및 데이터 재조회
    await queryClient.invalidateQueries({
      queryKey: queryKeys.shop.themePage(shopCode),
    });

    // Blob URL 정리
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    blobUrlsRef.current.clear();

    const refetchResult = await refetch();
    if (refetchResult.isSuccess && refetchResult.data?.data) {
      const nextThemePage = refetchResult.data.data;
      const nextInitLayout = nextThemePage.initPageLayout ?? 'LIGHT';
      const nextPageDetailType =
        nextInitLayout === 'DARK' ? 'INIT_DARK' : 'INIT_LIGHT';
      const refreshedDetails = nextThemePage.shopPageDetailList ?? [];
      const refreshedDetail = refreshedDetails.find(
        ({ pageDetailType }) => pageDetailType === nextPageDetailType
      );
      setCurrentLogoImage(refreshedDetail?.pageDetailImagePath ?? null);
      setCurrentLogoFile(null);
    }

    toast(t('로고 설정을 저장했습니다.'));
  }, [
    shopCode,
    themePage,
    shopSeqFromAuth,
    currentLogoFile,
    currentLogoImage,
    currentPageDetailType,
    initPageLayout,
    updateShopThemePage,
    queryClient,
    refetch,
  ]);

  if (!shopCode) {
    return null;
  }

  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Header>
          <S.Title>
            <h1>{t('시작 화면')}</h1>
            <div />
            <span>{t('로고 설정')}</span>
          </S.Title>
          <BasicButton variant="Solid_Navy_XL" onClick={handleSave}>
            {t('저장하기')}
          </BasicButton>
        </S.Header>
        <Logo imageUrl={currentLogoImage} onChange={handleLogoChange} />
      </S.Container>
    </UIStyles.setting.TablePageContainer>
  );
};

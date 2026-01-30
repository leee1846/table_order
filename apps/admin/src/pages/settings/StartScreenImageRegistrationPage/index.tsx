import { t } from '@/config/i18n';
import { useEffect, useRef, useState } from 'react';
import { BasicButton } from '@repo/ui/components';
import {
  queryKeys,
  useGetShopThemePage,
  usePutUpdateShopThemePage,
} from '@repo/api/queries';
import type { IShopPageDetail } from '@repo/api/types';
import { useQueryClient } from '@repo/api/tanstack-query';
import { toast } from '@repo/feature/utils';
import { useAuth } from '@/hooks/useAuth';
import { ImageRegistration } from '@/pages/settings/StartScreenImageRegistrationPage/ImageRegistration';
import { generateId } from '@repo/util/string';
import * as S from './startScreenImageRegistrationPage.style';
import * as UIStyles from '@repo/ui/styles';

type InitCommonItem = {
  id: number;
  description: string;
  imageUrl: string | null;
  pageDetailImageSeq?: number;
  pageDetailImageFileIndex?: number;
};

export const StartScreenImageRegistrationPage = () => {
  const { shopCode, shopSeq: shopSeqFromAuth } = useAuth();

  const queryClient = useQueryClient();

  // 생성된 blob URL들을 추적하여 메모리 누수 방지를 위한 ref
  const blobUrlsRef = useRef<Set<string>>(new Set());

  // blob URL을 해제하고 추적 목록에서 제거하는 함수
  // 메모리 누수를 방지하기 위해 더 이상 사용하지 않는 blob URL을 정리할 때 사용
  const revokeUrl = (url?: string | null) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url); //RL.createObjectURL()로 만든 blob URL을 해제해 메모리를 반환하는 함수
      blobUrlsRef.current.delete(url);
    }
  };

  // blob URL을 추적 목록에 추가하는 함수
  // 새로 생성된 blob URL을 관리하기 위해 사용
  const trackBlobUrl = (url?: string | null) => {
    if (url && url.startsWith('blob:')) {
      blobUrlsRef.current.add(url);
    }
  };

  const [initCommonItems, setInitCommonItems] = useState<InitCommonItem[]>([]);

  const [initCommonFiles, setInitCommonFiles] = useState<
    Record<number, File | null>
  >({});

  // 서버에서 로드된 기존 항목의 pageDetailImageSeq 목록을 추적
  const existingSeqsRef = useRef<Set<number>>(new Set());

  const { data, refetch } = useGetShopThemePage(shopCode ?? '', {
    enabled: !!shopCode,
  });

  console.log(
    'data',
    data?.data?.shopPageDetailList?.filter(
      ({ pageDetailType }) => pageDetailType === 'INIT_COMMON'
    )
  );

  const { mutateAsync: updateShopThemePage } = usePutUpdateShopThemePage();

  const themePage = data?.data;

  useEffect(() => {
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    blobUrlsRef.current.clear();
    initCommonItems.forEach((item) => revokeUrl(item.imageUrl));
    setInitCommonItems([]);
    setInitCommonFiles({});
  }, [shopCode]);

  useEffect(() => {
    if (!themePage) {
      return;
    }

    const pageDetails = themePage.shopPageDetailList ?? [];
    const initCommonDetails = pageDetails.filter(
      ({ pageDetailType }) => pageDetailType === 'INIT_COMMON'
    );

    // 기존 항목의 seq 목록 저장
    existingSeqsRef.current = new Set(
      initCommonDetails
        .map((detail) => detail.pageDetailImageSeq)
        .filter((seq): seq is number => seq !== null && seq !== undefined)
    );

    setInitCommonItems(
      initCommonDetails.map((detail, index) => ({
        id: detail.pageDetailImageSeq || index + 1,
        description: detail.pageDetailDescription ?? '',
        imageUrl: detail.pageDetailImagePath ?? null,
        pageDetailImageSeq: detail.pageDetailImageSeq,
        pageDetailImageFileIndex: detail.pageDetailImageFileIndex,
      }))
    );
    setInitCommonFiles({});
  }, [themePage]);

  useEffect(() => {
    const blobUrls = blobUrlsRef.current;
    return () => {
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
      blobUrls.clear();
    };
  }, []);

  const handleAddInitCommonItem = () => {
    setInitCommonItems((prev) => {
      const nextId =
        prev.length > 0 ? Math.max(...prev.map(({ id }) => id)) + 1 : 1;
      const nextPageDetailImageSeq =
        prev.length > 0
          ? Math.max(
              ...prev.map(({ pageDetailImageSeq }) => pageDetailImageSeq ?? 0)
            ) + 1
          : 1;
      return [
        ...prev,
        {
          id: nextId,
          description: '',
          imageUrl: null,
          pageDetailImageSeq: nextPageDetailImageSeq,
        },
      ];
    });
  };

  const handleChangeInitCommonDescription = (id: number, value: string) => {
    setInitCommonItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, description: value } : item
      )
    );
  };

  const handleChangeInitCommonImage = (id: number, file: File | null) => {
    setInitCommonFiles((prev) => ({ ...prev, [id]: file }));
    setInitCommonItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (item.imageUrl && item.imageUrl.startsWith('blob:')) {
          revokeUrl(item.imageUrl);
        }

        const nextUrl = file ? URL.createObjectURL(file) : null;
        trackBlobUrl(nextUrl);

        return { ...item, imageUrl: nextUrl };
      })
    );
  };

  const handleRemoveInitCommonImage = (id: number) => {
    handleChangeInitCommonImage(id, null);
  };

  const handleSave = async () => {
    if (!shopCode) {
      toast(t('매장 정보가 없습니다. 다시 로그인 후 시도해주세요.'));
      return;
    }

    const shopSeq = themePage?.shopSeq ?? shopSeqFromAuth;

    if (!shopSeq) {
      toast(t('매장 정보를 불러오지 못했습니다.'));
      return;
    }

    const createDetail = ({
      type,
      description,
      pageDetailImageSeq,
      pageDetailImagePath,
      pageDetailImageFileName,
      pageDetailImageFileIndex,
    }: {
      type: IShopPageDetail['pageDetailType'];
      description: string;
      pageDetailImageSeq?: number | null;
      pageDetailImagePath: string | null;
      pageDetailImageFileName?: string;
      pageDetailImageFileIndex?: number;
    }): IShopPageDetail => ({
      shopSeq,
      pageDetailType: type,
      pageDetailImageSeq: pageDetailImageSeq ?? 0,
      pageDetailImagePath,
      pageDetailDescription: description,
      pageDetailImageFileName,
      pageDetailImageFileIndex: pageDetailImageFileIndex ?? 0,
    });

    const initCommonFilesToSend: Array<{ file: File; fileName: string }> = [];

    const commonDetails = initCommonItems
      .flatMap((item, index) => {
        const file = initCommonFiles[item.id];
        if (file) {
          const imageId = generateId();
          const fileExtension = file.name.match(/\.([^.]+)$/)?.[0];
          const fileName = `${imageId}${fileExtension}`;
          initCommonFilesToSend.push({ file, fileName });

          // 기존 항목(서버에서 로드된 항목)이면 seq 유지, 새 항목이면 0
          const isExistingItem =
            item.pageDetailImageSeq &&
            existingSeqsRef.current.has(item.pageDetailImageSeq);

          return [
            createDetail({
              type: 'INIT_COMMON',
              pageDetailImageSeq: isExistingItem ? item.pageDetailImageSeq : 0,
              pageDetailImagePath: null,
              pageDetailImageFileName: imageId,
              description: item.description,
              pageDetailImageFileIndex:
                item.pageDetailImageFileIndex ?? index + 1,
            }),
          ];
        }

        if (item.imageUrl) {
          return [
            createDetail({
              type: 'INIT_COMMON',
              pageDetailImageSeq: item.pageDetailImageSeq ?? 0,
              pageDetailImagePath: item.imageUrl,
              pageDetailImageFileName: '',
              description: item.description,
              pageDetailImageFileIndex:
                item.pageDetailImageFileIndex ?? index + 1,
            }),
          ];
        }

        return [];
      })
      .sort(
        (a, b) =>
          (a.pageDetailImageFileIndex ?? 0) - (b.pageDetailImageFileIndex ?? 0)
      );

    const pageDetails = themePage?.shopPageDetailList ?? [];
    const otherDetails = pageDetails.filter(
      ({ pageDetailType }) => pageDetailType !== 'INIT_COMMON'
    );

    const shopPageDetailList: IShopPageDetail[] = [
      ...otherDetails,
      ...commonDetails,
    ];

    await updateShopThemePage({
      shopCode,
      body: {
        shopSeq,
        initPageLayout: themePage?.initPageLayout ?? 'LIGHT',
        orderCompletePageLayout:
          themePage?.orderCompletePageLayout ?? 'DEFAULT',
        shopPageDetailList,
      },
      initCommonFiles: initCommonFilesToSend,
    });

    await queryClient.invalidateQueries({
      queryKey: queryKeys.shop.themePage(shopCode),
    });
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    blobUrlsRef.current.clear();
    await refetch();
    toast(t('이미지 등록을 저장했습니다.'));
  };

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
            <span>{t('이미지 등록')}</span>
          </S.Title>
          <BasicButton variant="Solid_Navy_XL" onClick={handleSave}>
            {t('저장하기')}
          </BasicButton>
        </S.Header>
        <ImageRegistration
          items={initCommonItems}
          onAddItem={handleAddInitCommonItem}
          onChangeDescription={handleChangeInitCommonDescription}
          onChangeImage={handleChangeInitCommonImage}
          onRemoveImage={handleRemoveInitCommonImage}
        />
      </S.Container>
    </UIStyles.setting.TablePageContainer>
  );
};

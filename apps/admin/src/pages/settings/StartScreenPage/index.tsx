import { t } from '@/config/i18n';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BasicButton, Input } from '@repo/ui/components';
import {
  queryKeys,
  useGetShopThemePage,
  usePutUpdateShopThemePage,
} from '@repo/api/queries';
import type {
  IShopPageDetail,
  TInitPageLayout,
  TOrderCompletePageLayout,
  TPageDetailType,
} from '@repo/api/types';
import { useQueryClient } from '@repo/api/tanstack-query';
import { toast } from '@repo/feature/utils';
import { useAuth } from '@/hooks/useAuth';
import { Theme } from '@/pages/settings/StartScreenPage/Theme';
import { Logo } from '@/pages/settings/StartScreenPage/Logo';
import { ImageRegistration } from '@/pages/settings/StartScreenPage/ImageRegistration';
import { OrderCompletionPage } from '@/pages/settings/StartScreenPage/OrderCompletionPage';
import * as S from './startScreenPage.style';
import * as UIStyles from '@repo/ui/styles';

type InitCommonItem = {
  id: number;
  description: string;
  imageUrl: string | null;
  pageDetailImageSeq?: number;
};

export const StartScreenPage = () => {
  const { shopCode, shopSeq: shopSeqFromAuth } = useAuth();
  const queryClient = useQueryClient();
  const blobUrlsRef = useRef<Set<string>>(new Set());
  const revokeUrl = (url?: string | null) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
      blobUrlsRef.current.delete(url);
    }
  };
  const trackBlobUrl = (url?: string | null) => {
    if (url && url.startsWith('blob:')) {
      blobUrlsRef.current.add(url);
    }
  };

  const [isInitialized, setIsInitialized] = useState(false);
  const [initPageLayout, setInitPageLayout] =
    useState<TInitPageLayout>('LIGHT');
  const [orderCompletePageLayout, setOrderCompletePageLayout] =
    useState<TOrderCompletePageLayout>('DEFAULT');
  const [orderCompleteMessage, setOrderCompleteMessage] = useState('');
  const [orderCompleteImageUrl, setOrderCompleteImageUrl] = useState<
    string | null
  >(null);
  const [orderCompleteImageSeq, setOrderCompleteImageSeq] = useState<
    number | null
  >(null);
  const [orderCompleteFile, setOrderCompleteFile] = useState<File | null>(null);
  const [storeName, setStoreName] = useState('');
  const [logoImages, setLogoImages] = useState<{
    LIGHT: string | null;
    DARK: string | null;
  }>({ LIGHT: null, DARK: null });
  const [logoFiles, setLogoFiles] = useState<{
    LIGHT: File | null;
    DARK: File | null;
  }>({ LIGHT: null, DARK: null });
  const [initLightImageSeq, setInitLightImageSeq] = useState<number | null>(
    null
  );
  const [initDarkImageSeq, setInitDarkImageSeq] = useState<number | null>(null);
  const [initCommonItems, setInitCommonItems] = useState<InitCommonItem[]>([]);
  const [initCommonFiles, setInitCommonFiles] = useState<
    Record<number, File | null>
  >({});

  const { data, refetch } = useGetShopThemePage(shopCode ?? '', {
    enabled: !!shopCode,
  });

  const { mutateAsync: updateShopThemePage, isPending: isSaving } =
    usePutUpdateShopThemePage();

  const themePage = data?.data;

  useEffect(() => {
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    blobUrlsRef.current.clear();
    initCommonItems.forEach((item) => revokeUrl(item.imageUrl));
    revokeUrl(orderCompleteImageUrl);
    setIsInitialized(false);
    setInitPageLayout('LIGHT');
    setOrderCompletePageLayout('DEFAULT');
    setOrderCompleteMessage('');
    setOrderCompleteImageUrl(null);
    setOrderCompleteImageSeq(null);
    setOrderCompleteFile(null);
    setStoreName('');
    setLogoImages({ LIGHT: null, DARK: null });
    setLogoFiles({ LIGHT: null, DARK: null });
    setInitLightImageSeq(null);
    setInitDarkImageSeq(null);
    setInitCommonItems([]);
    setInitCommonFiles({});
  }, [shopCode]);

  useEffect(() => {
    if (!themePage || isInitialized) {
      return;
    }

    const pageDetails = themePage.shopPageDetailList ?? [];
    const initLight = pageDetails.find(
      ({ pageDetailType }) => pageDetailType === 'INIT_LIGHT'
    );
    const initDark = pageDetails.find(
      ({ pageDetailType }) => pageDetailType === 'INIT_DARK'
    );
    const orderComplete = pageDetails.find(
      ({ pageDetailType }) => pageDetailType === 'ORDER_COMPLETE'
    );

    setInitPageLayout(themePage.initPageLayout);
    setOrderCompletePageLayout(themePage.orderCompletePageLayout);
    setLogoImages({
      LIGHT: initLight?.pageDetailImagePath ?? null,
      DARK: initDark?.pageDetailImagePath ?? null,
    });
    setLogoFiles({ LIGHT: null, DARK: null });
    setInitLightImageSeq(initLight?.pageDetailImageSeq ?? null);
    setInitDarkImageSeq(initDark?.pageDetailImageSeq ?? null);
    setOrderCompleteMessage(orderComplete?.pageDetailDescription ?? '');
    setOrderCompleteImageUrl(orderComplete?.pageDetailImagePath ?? null);
    setOrderCompleteImageSeq(orderComplete?.pageDetailImageSeq ?? null);
    setOrderCompleteFile(null);
    setStoreName(
      initDark?.pageDetailDescription ?? initLight?.pageDetailDescription ?? ''
    );
    setInitCommonItems(
      pageDetails
        .filter(({ pageDetailType }) => pageDetailType === 'INIT_COMMON')
        .map((detail, index) => ({
          id: detail.pageDetailImageSeq || index + 1,
          description: detail.pageDetailDescription ?? '',
          imageUrl: detail.pageDetailImagePath ?? null,
          pageDetailImageSeq: detail.pageDetailImageSeq,
        }))
    );
    setInitCommonFiles({});
    setIsInitialized(true);
  }, [isInitialized, themePage]);

  useEffect(() => {
    return () => {
      initCommonItems.forEach((item) => revokeUrl(item.imageUrl));
      revokeUrl(orderCompleteImageUrl);
    };
  }, [initCommonItems, orderCompleteImageUrl]);

  const currentLogoImage = useMemo(() => {
    if (initPageLayout === 'LIGHT') {
      return logoImages.LIGHT;
    }
    if (initPageLayout === 'DARK') {
      return logoImages.DARK;
    }
    return null;
  }, [initPageLayout, logoImages]);

  const handleLogoChange = (file: File | null, previewUrl: string | null) => {
    if (initPageLayout === 'IMAGE') {
      return;
    }

    trackBlobUrl(previewUrl);
    setLogoImages((prev) => ({
      ...prev,
      [initPageLayout]: previewUrl,
    }));
    setLogoFiles((prev) => ({
      ...prev,
      [initPageLayout]: file,
    }));
  };

  const handleAddInitCommonItem = () => {
    setInitCommonItems((prev) => {
      const nextId =
        prev.length > 0 ? Math.max(...prev.map(({ id }) => id)) + 1 : 1;
      return [
        ...prev,
        { id: nextId, description: '', imageUrl: null, pageDetailImageSeq: 0 },
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

  const handleChangeOrderCompleteImage = (file: File | null) => {
    revokeUrl(orderCompleteImageUrl);
    const nextUrl = file ? URL.createObjectURL(file) : null;
    trackBlobUrl(nextUrl);
    setOrderCompleteImageUrl(nextUrl);
    setOrderCompleteFile(file);
  };

  const buildDetail = (
    type: TPageDetailType,
    pageDetailImageSeq: number | null,
    imagePath: string | null,
    description: string,
    shopSeq: number
  ): IShopPageDetail => ({
    shopSeq,
    pageSeq: 0,
    pageDetailType: type,
    pageDetailImageSeq: pageDetailImageSeq ?? 0,
    pageDetailImagePath: imagePath,
    pageDetailDescription: description,
  });

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

    const shopPageDetailList: IShopPageDetail[] = [
      buildDetail(
        'INIT_LIGHT',
        initLightImageSeq,
        logoFiles.LIGHT ? null : logoImages.LIGHT,
        storeName,
        shopSeq
      ),
      buildDetail(
        'INIT_DARK',
        initDarkImageSeq,
        logoFiles.DARK ? null : logoImages.DARK,
        storeName,
        shopSeq
      ),
      ...initCommonItems.map((item) =>
        buildDetail(
          'INIT_COMMON',
          item.pageDetailImageSeq ?? null,
          initCommonFiles[item.id] ? null : item.imageUrl,
          item.description,
          shopSeq
        )
      ),
      buildDetail(
        'ORDER_COMPLETE',
        orderCompleteImageSeq,
        orderCompleteFile ? null : orderCompleteImageUrl,
        orderCompleteMessage,
        shopSeq
      ),
    ];

    await updateShopThemePage({
      body: {
        shopSeq,
        initPageLayout,
        orderCompletePageLayout,
        shopPageDetailList,
      },
      initLightFile: logoFiles.LIGHT,
      initDarkFile: logoFiles.DARK,
      orderCompleteFile,
      initCommonFiles: initCommonItems.map(
        (item) => initCommonFiles[item.id] ?? null
      ),
    });

    await queryClient.invalidateQueries({
      queryKey: queryKeys.shop.themePage(shopCode),
    });
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    blobUrlsRef.current.clear();
    setIsInitialized(false);
    await refetch();
    toast(t('시작 화면을 저장했습니다.'));
  };

  if (!shopCode) {
    return null;
  }

  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Header>
          <S.Title>
            <h1>{t('테마 설정')}</h1>
            <div />
            <span>{t('시작 화면')}</span>
          </S.Title>
          <BasicButton
            variant="Solid_Navy_XL"
            onClick={handleSave}
            disabled={isSaving}
          >
            {t('저장하기')}
          </BasicButton>
        </S.Header>
        <Theme value={initPageLayout} onChange={setInitPageLayout} />
        {initPageLayout === 'LIGHT' && (
          <Logo imageUrl={currentLogoImage} onChange={handleLogoChange} />
        )}
        {initPageLayout === 'DARK' && (
          <S.FieldGroup>
            <label htmlFor="storeName">{t('매장 이름')}</label>
            <Input
              name="text"
              value={storeName}
              onChange={setStoreName}
              placeholder={t('매장 이름을 입력해주세요.')}
            />
          </S.FieldGroup>
        )}
        <ImageRegistration
          items={initCommonItems}
          onAddItem={handleAddInitCommonItem}
          onChangeDescription={handleChangeInitCommonDescription}
          onChangeImage={handleChangeInitCommonImage}
          onRemoveImage={handleRemoveInitCommonImage}
        />

        <OrderCompletionPage
          layout={orderCompletePageLayout}
          message={orderCompleteMessage}
          imageUrl={orderCompleteImageUrl}
          onChangeImage={handleChangeOrderCompleteImage}
          onChangeLayout={setOrderCompletePageLayout}
          onChangeMessage={setOrderCompleteMessage}
        />
      </S.Container>
    </UIStyles.setting.TablePageContainer>
  );
};

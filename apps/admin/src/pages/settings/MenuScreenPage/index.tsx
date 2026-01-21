import { t } from '@/config/i18n';
import { useCallback, useEffect, useState } from 'react';
import { BasicButton } from '@repo/ui/components';
import {
  queryKeys,
  useGetShopThemeMenu,
  usePutUpdateShopThemeMenu,
} from '@repo/api/queries';
import {
  type IUpdateShopThemeMenuRequest,
  type TMenuboardTemplateType,
} from '@repo/api/types';
import { useQueryClient } from '@repo/api/tanstack-query';
import { toast } from '@repo/feature/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  ScreenMode,
  type ScreenModeOption,
} from '@/pages/settings/MenuScreenPage/ScreenMode';
import { Logo } from '@/pages/settings/MenuScreenPage/Logo';
import { Template } from '@/pages/settings/MenuScreenPage/Template';
import * as S from './menuScreenPage.style';

export const MenuScreenPage = () => {
  const queryClient = useQueryClient();
  const { shopCode, shopSeq: shopSeqFromAuth } = useAuth();
  const [screenMode, setScreenMode] = useState<ScreenModeOption>('light');
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isMenuThreeColumnLayout, setIsMenuThreeColumnLayout] = useState(false);
  const [templateType, setTemplateType] =
    useState<TMenuboardTemplateType>('DEFAULT');

  const { data: themeMenuResponse, refetch } = useGetShopThemeMenu(
    shopCode ?? '',
    {
      enabled: !!shopCode,
    }
  );

  const { mutateAsync: updateThemeMenu } = usePutUpdateShopThemeMenu();

  const themeMenu = themeMenuResponse?.data;

  useEffect(() => {
    setScreenMode('light');
    setLogoImageUrl(null);
    setLogoFile(null);
    setIsMenuThreeColumnLayout(false);
    setTemplateType('DEFAULT');
  }, [shopCode]);

  useEffect(() => {
    if (!themeMenu) {
      return;
    }

    setScreenMode(themeMenu.useDarkTheme ? 'dark' : 'light');
    setLogoImageUrl(themeMenu.logoImagePath || null);
    setLogoFile(null);
    setIsMenuThreeColumnLayout(themeMenu.isMenuThreeColumnLayout);
    setTemplateType(themeMenu.menuboardTemplateType);
  }, [themeMenu]);

  const handleLogoChange = useCallback(
    (file: File | null, previewUrl: string | null) => {
      setLogoFile(file);
      setLogoImageUrl(previewUrl);
    },
    []
  );

  const handleSave = async () => {
    if (!shopCode) {
      toast(t('매장 정보가 없습니다. 다시 로그인 후 시도해주세요.'));
      return;
    }

    const shopSeq = themeMenu?.shopSeq ?? shopSeqFromAuth;
    if (!shopSeq) {
      toast(t('매장 정보를 불러오지 못했습니다.'));
      return;
    }

    // 새 파일을 업로드하는 경우 logoImagePath는 null로 설정
    // (서버가 파일을 업로드하고 타임스탬프 파일명으로 경로를 생성함)
    // 기존 파일을 유지하는 경우에만 logoImagePath를 전달
    const logoImagePath = logoFile
      ? null
      : logoImageUrl && !logoImageUrl.startsWith('blob:')
        ? logoImageUrl
        : null;

    const body: IUpdateShopThemeMenuRequest = {
      shopSeq,
      logoImagePath,
      useDarkTheme: screenMode === 'dark',
      isMenuThreeColumnLayout,
      menuboardTemplateType: templateType,
    };

    await updateThemeMenu({ shopCode, body, logoFile });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.shop.themeMenu(shopCode),
    });
    await refetch();
    toast(t('메뉴 화면 설정을 저장했습니다.'));
  };

  if (!shopCode) {
    return null;
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>
          <h1>{t('테마설정')}</h1>
          <div />
          <span>{t('메뉴 화면')}</span>
        </S.Title>
        <BasicButton variant="Solid_Navy_XL" onClick={handleSave}>
          {t('저장하기')}
        </BasicButton>
      </S.Header>

      <ScreenMode mode={screenMode} onChange={setScreenMode} />
      <Logo imageUrl={logoImageUrl} onChange={handleLogoChange} />
      <Template
        isMenuThreeColumnLayout={isMenuThreeColumnLayout}
        templateType={templateType}
        onChangeThreeColumnLayout={setIsMenuThreeColumnLayout}
        onChangeTemplateType={setTemplateType}
      />
    </S.Container>
  );
};

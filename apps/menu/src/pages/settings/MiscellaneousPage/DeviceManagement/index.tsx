import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { CapacitorApp, SettingsLauncher } from '@repo/util/app';
import { toast } from '@repo/feature/utils';

export const DeviceManagement = () => {
  const { t } = useAdminTranslation();

  const handleOpenDeviceSettings = async () => {
    if (!CapacitorApp.isNative()) {
      toast(t('태블릿(네이티브) 환경에서만 사용할 수 있습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
      return;
    }

    try {
      await SettingsLauncher.open('root');
    } catch {
      toast(t('설정 화면을 열 수 없습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
    }
  };

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <UIStyles.setting.Title>{t('디바이스 관리')}</UIStyles.setting.Title>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>{t('시스템 설정')}</p>
          <BasicButton
            variant="Outline_Grey_M"
            onClick={handleOpenDeviceSettings}
          >
            {t('설정')}
          </BasicButton>
        </UIStyles.setting.ContentLayout>
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};

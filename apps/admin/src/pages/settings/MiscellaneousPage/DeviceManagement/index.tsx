import { useAdminTranslation } from '@/config/i18n';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { BasicButton } from '@repo/ui/components';
import { SettingsIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
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
    <SectionWrapper
      title={t('디바이스 관리')}
      icon={
        <SettingsIcon
          width={32}
          height={32}
          color={theme.colors.primary[500]}
        />
      }
    >
      <UIStyles.setting.ContentLayout>
        <p>{t('시스템 설정')}</p>
        <BasicButton
          variant="Outline_Grey_M"
          onClick={handleOpenDeviceSettings}
        >
          {t('환경 설정')}
        </BasicButton>
      </UIStyles.setting.ContentLayout>
    </SectionWrapper>
  );
};

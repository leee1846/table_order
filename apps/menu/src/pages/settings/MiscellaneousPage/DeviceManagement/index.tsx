import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { SettingsLauncher } from '@repo/util/app';
import { openDualActionDialog, toast } from '@repo/feature/utils';

export const DeviceManagement = () => {
  const { t } = useAdminTranslation();

  const handleOpenDeviceSettings = async () => {
    try {
      await SettingsLauncher.open('root');
    } catch {
      toast(t('설정 화면을 열 수 없습니다.'), {
        position: 'center-center',
        duration: 1500,
      });
    }
  };

  const sendLog = async () => {
    openDualActionDialog({
      title: t('앱 로그 전송'),
      content: t('앱 로그를 전송하시겠습니까?'),
      primaryText: t('확인'),
      secondaryText: t('취소'),
      onConfirm: () => {
        // TODO: 로그 전송 로직 구현
      },
    });
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

        <UIStyles.setting.ContentLayout>
          <p>{t('앱 로그 전송')}</p>
          <BasicButton variant="Outline_Grey_M" onClick={sendLog}>
            {t('로그 전송')}
          </BasicButton>
        </UIStyles.setting.ContentLayout>
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};

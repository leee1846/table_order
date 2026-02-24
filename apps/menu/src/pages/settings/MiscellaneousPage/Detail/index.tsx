import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Detail/detail.style';
import { ToggleButton } from '@repo/ui/components';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useGetLatestAppVersion } from '@repo/api/queries';

interface Props {
  useOrderposMode: boolean;
  onChangeUseOrderposMode: () => void;
  orderPosNumber: number | null;
  handleOrderPosNumberChange: (value: string) => void;
}

export const Detail = ({
  useOrderposMode,
  onChangeUseOrderposMode,
  orderPosNumber,
  handleOrderPosNumberChange,
}: Props) => {
  const { t } = useAdminTranslation();
  const { data: deviceData } = useDeviceData();
  const { data: latestVersionData } = useGetLatestAppVersion('MENU');

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <UIStyles.setting.Title>{t('버전 및 네트워크')}</UIStyles.setting.Title>
        <S.Versions>
          {/* Q/A동안 노출 버전 */}
          {/* TODO: 삭제 예정 */}
          <p>
            {t('WEB 버전')} <span>1.0.7</span>
          </p>
          <div />
          <p>
            {t('APP 버전')} <span>{deviceData?.version}</span>
          </p>
          <div />
          <p>
            {t('APP 최신 버전')}{' '}
            <span>{latestVersionData?.data?.version ?? '-'}</span>
          </p>
        </S.Versions>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>{t('오더포스 모드 사용')}</p>
          <ToggleButton
            size="M"
            isOn={useOrderposMode}
            onChange={onChangeUseOrderposMode}
          />
        </UIStyles.setting.ContentLayout>
        {useOrderposMode && (
          <UIStyles.setting.ContentLayout>
            <p>{t('오더포스 번호')}</p>
            <input
              type="tel"
              value={orderPosNumber || ''}
              onChange={(e) => handleOrderPosNumberChange(e.target.value)}
              style={{ textAlign: 'center' }}
              maxLength={100}
            />
          </UIStyles.setting.ContentLayout>
        )}
        {/* <UIStyles.setting.ContentLayout>
          <p>{t('카드 단말기')}</p>
          <Dropdown
            options={[]}
            value={null}
            onChange={() => {
              // noop
            }}
            disabled={true}
          />
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>{t('KDS 모드 사용')}</p>
          <ToggleButton
            size="M"
            isOn={false}
            onChange={() => {
              // noop
            }}
            disabled={true}
          />
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>{t('웨이팅 모드 사용')}</p>
          <ToggleButton
            size="M"
            disabled={true}
            isOn={false}
            onChange={() => {
              // noop
            }}
          />
        </UIStyles.setting.ContentLayout> */}
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};

import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Detail/detail.style';
import { Dropdown, ToggleButton } from '@repo/ui/components';
import { useAdminTranslation } from '@/config/i18n/admin.i18n';
import { useDeviceData } from '@/hooks/useDeviceData';

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

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <UIStyles.setting.Title>{t('버전 및 네트워크')}</UIStyles.setting.Title>
        <S.Versions>
          <p>
            {t('메뉴판 현재 버전')} <span>2.??.??</span>
          </p>
          <div />
          <p>
            {t('최신 버전')} <span>2.??.??</span>
          </p>
          <div />
          <p>
            {t('Add On 버전')} <span>2.??</span>
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
        <UIStyles.setting.ContentLayout>
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
        </UIStyles.setting.ContentLayout>
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};

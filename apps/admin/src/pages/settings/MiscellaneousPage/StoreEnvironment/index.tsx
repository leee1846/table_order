import { useAdminTranslation } from '@/config/i18n';
import { useEffect, useRef, useState } from 'react';
import type { IShopSetting, IShopTime, TMenuboardType } from '@repo/api/types';
import * as UIStyles from '@repo/ui/styles';
import { SettingSwitch } from '@/pages/settings/MiscellaneousPage/common/SettingSwitch';
import { useTimeInput } from '@/hooks/useTimeInput';
import { StoreIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './storeEnvironment.style';
import type { MiscellaneousChange } from '../types';

interface StoreEnvironmentProps {
  shopSetting?: IShopSetting;
  shopTime?: IShopTime;
  onChange?: (value: MiscellaneousChange) => void;
}

export const StoreEnvironment = ({
  shopSetting,
  shopTime,
  onChange,
}: StoreEnvironmentProps) => {
  const { t } = useAdminTranslation();
  const [tableOccupationTime, setTableOccupationTime] = useState(false);
  const [menuboardType, setMenuboardType] = useState<TMenuboardType | ''>('');

  const endHourRef = useRef<HTMLInputElement>(null);
  const startTime = useTimeInput({ nextRef: endHourRef });
  const endTime = useTimeInput();
  const { setTime: setStartTime } = startTime;
  const { setTime: setEndTime } = endTime;
  const toTimeString = (hour: string, minute: string) =>
    hour && minute
      ? `${hour.padStart(2, '0')}${minute.padStart(2, '0')}`
      : undefined;

  useEffect(() => {
    if (!shopSetting) {
      return;
    }

    setTableOccupationTime(Boolean(shopSetting.useTableOccupancyTime));
    setMenuboardType(shopSetting.menuboardType ?? '');
  }, [shopSetting]);

  useEffect(() => {
    if (!shopTime) {
      return;
    }

    setStartTime(shopTime.shopBusinessStartTime);
    setEndTime(shopTime.shopBusinessEndTime);
  }, [shopTime, setEndTime, setStartTime]);

  useEffect(() => {
    if (!onChange) {
      return;
    }

    const startTimeValue = toTimeString(startTime.hour, startTime.minute);
    const endTimeValue = toTimeString(endTime.hour, endTime.minute);

    onChange({
      shopSetting: {
        useTableOccupancyTime: tableOccupationTime,
        menuboardType: menuboardType || undefined,
      },
      shopTime: {
        shopBusinessStartTime: startTimeValue,
        shopBusinessEndTime: endTimeValue,
      },
    });
  }, [
    endTime.hour,
    endTime.minute,
    menuboardType,
    onChange,
    startTime.hour,
    startTime.minute,
    tableOccupationTime,
  ]);

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <S.TitleContentContainer>
          <StoreIcon width={32} height={32} color={theme.colors.primary[500]} />
          <UIStyles.setting.Title>{t('매장 운영 조건')}</UIStyles.setting.Title>
        </S.TitleContentContainer>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>{t('고객 테이블 이용 시간 표시')}</p>
          <SettingSwitch
            checked={tableOccupationTime}
            onChange={setTableOccupationTime}
          />
        </UIStyles.setting.ContentLayout>
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};

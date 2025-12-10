import { useEffect, useRef, useState } from 'react';
import type { IShopSetting, IShopTime, TMenuboardType } from '@repo/api/types';
import * as UIStyles from '@repo/ui/styles';
import { Dropdown, ToggleButton } from '@repo/ui/components';
import { useTimeInput } from '@/hooks/useTimeInput';
import { StoreIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './storeEnvironment.style';

interface StoreEnvironmentProps {
  shopSetting?: IShopSetting;
  shopTime?: IShopTime;
}

const menuboardTypeOptions = [
  { value: 'PLUS' as TMenuboardType, label: '플러스형' },
  { value: 'MINUS' as TMenuboardType, label: '마이너스형' },
];

export const StoreEnvironment = ({
  shopSetting,
  shopTime,
}: StoreEnvironmentProps) => {
  const [tableOccupationTime, setTableOccupationTime] = useState(false);
  const [menuboardType, setMenuboardType] = useState<TMenuboardType | ''>('');

  const endHourRef = useRef<HTMLInputElement>(null);
  const startTime = useTimeInput({ nextRef: endHourRef });
  const endTime = useTimeInput();
  const { setTime: setStartTime } = startTime;
  const { setTime: setEndTime } = endTime;

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

  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <S.TitleContentContainer>
          <StoreIcon width={32} height={32} color={theme.colors.primary[500]} />
          <UIStyles.setting.Title>매장 환경</UIStyles.setting.Title>
        </S.TitleContentContainer>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>정산 시간 (영업 시간)</p>
          <UIStyles.setting.TimeRangeInput>
            <input
              type="text"
              inputMode="numeric"
              placeholder="00"
              value={startTime.hour}
              onChange={startTime.handleHourChange}
              maxLength={2}
            />
            <span>:</span>
            <input
              ref={startTime.minuteRef}
              type="text"
              inputMode="numeric"
              placeholder="00"
              value={startTime.minute}
              onChange={startTime.handleMinuteChange}
              onKeyDown={startTime.handleMinuteKeyDown}
              maxLength={2}
            />
            <span>-</span>
            <input
              ref={endHourRef}
              type="text"
              inputMode="numeric"
              placeholder="00"
              value={endTime.hour}
              onChange={endTime.handleHourChange}
              maxLength={2}
            />
            <span>:</span>
            <input
              ref={endTime.minuteRef}
              type="text"
              inputMode="numeric"
              placeholder="00"
              value={endTime.minute}
              onChange={endTime.handleMinuteChange}
              onKeyDown={endTime.handleMinuteKeyDown}
              maxLength={2}
            />
          </UIStyles.setting.TimeRangeInput>
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>테이블 점유시간 표기</p>
          <ToggleButton
            size="M"
            isOn={tableOccupationTime}
            onChange={() => setTableOccupationTime(!tableOccupationTime)}
          />
        </UIStyles.setting.ContentLayout>
        <UIStyles.setting.ContentLayout>
          <p>메뉴판 타입</p>
          <Dropdown
            options={menuboardTypeOptions}
            value={menuboardType}
            onChange={(value) => setMenuboardType(value as TMenuboardType | '')}
          />
        </UIStyles.setting.ContentLayout>
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};

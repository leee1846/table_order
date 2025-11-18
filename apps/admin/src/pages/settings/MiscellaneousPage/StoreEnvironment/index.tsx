import * as CommonStyles from '@/pages/settings/MiscellaneousPage/common/common.style';
import { Dropdown, ToggleButton } from '@repo/ui/components';
import { useState, useRef } from 'react';
import { useTimeInput } from '@repo/feature/hooks';

export const StoreEnvironment = () => {
  const [tableOccupationTime, setTableOccupationTime] = useState(false);

  const endHourRef = useRef<HTMLInputElement>(null);
  const startTime = useTimeInput({ nextRef: endHourRef });
  const endTime = useTimeInput();

  return (
    <CommonStyles.Container>
      <CommonStyles.Header>
        <CommonStyles.Title>매장 환경</CommonStyles.Title>
      </CommonStyles.Header>

      <CommonStyles.ContentsLayout>
        <CommonStyles.ContentLayout>
          <p>정산 시간 (영업 시간)</p>
          <CommonStyles.TimeRangeInput>
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
          </CommonStyles.TimeRangeInput>
        </CommonStyles.ContentLayout>
        <CommonStyles.ContentLayout>
          <p>테이블 점유시간 표기</p>
          <ToggleButton
            size="M"
            isOn={tableOccupationTime}
            onChange={() => setTableOccupationTime(!tableOccupationTime)}
          />
        </CommonStyles.ContentLayout>
        <CommonStyles.ContentLayout>
          <p>메뉴판 타입</p>
          <Dropdown options={[]} value={''} onChange={() => {}} />
        </CommonStyles.ContentLayout>
      </CommonStyles.ContentsLayout>
    </CommonStyles.Container>
  );
};

import { useEffect, useRef, useState } from 'react';
import { useGetCategoryList } from '@repo/api/queries';
import type { IShopSetting, IShopTime } from '@repo/api/types';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import {
  BasicButton,
  CheckButton,
  Dropdown,
  ToggleButton,
} from '@repo/ui/components';

interface TimeOption {
  value: string;
  label: string;
}
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/MenuAppFeature/menuAppFeature.style';
import { useTimeInput } from '@/hooks/useTimeInput';
import { theme } from '@repo/ui';
import { DeleteIcon, MenuBookIcon } from '@repo/ui/icons';
import { CategoryModal } from './CategoryModal';
import { DAYS } from '@/constants/days';
import { normalizeNumberString } from '@repo/util/string';

interface MenuAppFeatureProps {
  shopSetting?: IShopSetting;
  shopTime?: IShopTime;
}

const numberToString = (value?: number | null) =>
  value === undefined || value === null ? '' : String(value);

interface BreakTimeRow {
  id: string;
  isEveryDay: boolean;
  startTime: string;
  endTime: string;
  selectedDays: number[];
}

// 시간 옵션 생성 (00:00 ~ 23:59, 30분 단위)
const generateTimeOptions = (): TimeOption[] =>
  Array.from({ length: 24 }, (_, hour) =>
    [0, 30].map((minute) => {
      const hourStr = String(hour).padStart(2, '0');
      const minuteStr = String(minute).padStart(2, '0');
      return {
        value: `${hourStr}${minuteStr}`,
        label: `${hourStr}시 ${minuteStr}분`,
      };
    })
  ).flat();

const TIME_OPTIONS = generateTimeOptions();

const toMinutes = (time?: string | null) => {
  if (!time) {
    return null;
  }

  const digits = time.replace(/\D/g, '');
  if (digits.length !== 4) {
    return null;
  }

  const hour = Number(digits.slice(0, 2));
  const minute = Number(digits.slice(2));
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  return hour * 60 + minute;
};

const formatTime = (minutes: number) => {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;

  return `${hour.toString().padStart(2, '0')}${minute
    .toString()
    .padStart(2, '0')}`;
};

const calculateTimeBefore = (
  baseTime?: string | null,
  minutes?: number | null
) => {
  const baseMinutes = toMinutes(baseTime);

  if (baseMinutes === null || minutes === undefined || minutes === null) {
    return undefined;
  }

  return formatTime(baseMinutes - minutes);
};

export const MenuAppFeature = ({
  shopSetting,
  shopTime,
}: MenuAppFeatureProps) => {
  const [isOrderable, setIsOrderable] = useState(false);
  const [firstOrderMinAmount, setFirstOrderMinAmount] = useState('');
  const [useCustomerCount, setUseCustomerCount] = useState(false);
  const [useKidsCustomerCount, setUseKidsCustomerCount] = useState(false);
  const [isOrderSheetTotalVisible, setIsOrderSheetTotalVisible] =
    useState(false);
  const [isOrderCompleteTotalVisible, setIsOrderCompleteTotalVisible] =
    useState(false);
  const [useSinglePageMenuboard, setUseSinglePageMenuboard] = useState(false);
  const [menuboardAdminPassword, setMenuboardAdminPassword] = useState('');
  const [isAdminLocked, setIsAdminLocked] = useState(false);
  const [useTheftPrevention, setUseTheftPrevention] = useState(false);
  const [usePickupAlert, setUsePickupAlert] = useState(false);
  const [pickupAlertMessage, setPickupAlertMessage] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategorySeqs, setSelectedCategorySeqs] = useState<number[]>(
    []
  );
  const shopSeq = shopSetting?.shopSeq;

  // TODO 컬럼 추가해주시기로 함
  const [useBreakTime, setUseBreakTime] = useState(false);
  const [breakTimeRows, setBreakTimeRows] = useState<BreakTimeRow[]>([]);
  const [breakTimeLastOrderMinutes, setBreakTimeLastOrderMinutes] =
    useState('');
  const [breakTimeLastOrderAlertMinutes, setBreakTimeLastOrderAlertMinutes] =
    useState('');
  const [breakTimeMessage, setBreakTimeMessage] = useState('');
  const [breakTimeLastOrderMessage, setBreakTimeLastOrderMessage] =
    useState('');

  const {
    data: categoryListResponse,
    isFetching: isCategoryListLoading,
    refetch: refetchCategoryList,
  } = useGetCategoryList({ shopSeq: shopSeq ?? 0 }, { enabled: false });

  const closureEndHourRef = useRef<HTMLInputElement>(null);
  const closureStartTime = useTimeInput({ nextRef: closureEndHourRef });
  const closureEndTime = useTimeInput();
  const closureLastOrderHourRef = useRef<HTMLInputElement>(null);
  const closureLastOrderTime = useTimeInput({
    nextRef: closureLastOrderHourRef,
  });

  const { setTime: setClosureStartTime } = closureStartTime;
  const { setTime: setClosureEndTime } = closureEndTime;
  const { setTime: setClosureLastOrderTime } = closureLastOrderTime;

  // TODO 컬럼 추가해주시기로 함
  const [useClosureNotice, setUseClosureNotice] = useState(false);
  const [closureLastOrderTimeBefore, setClosureLastOrderTimeBefore] =
    useState('');
  const [closureLastOrderMinutes, setClosureLastOrderMinutes] = useState('');
  const [closureLastOrderMessage, setClosureLastOrderMessage] = useState('');
  const [closureMessage, setClosureMessage] = useState('');

  useEffect(() => {
    if (!shopSetting) {
      return;
    }

    setIsOrderable(Boolean(shopSetting.isMenuboardOrderable));
    setFirstOrderMinAmount(
      shopSetting.firstOrderMinAmount !== undefined
        ? String(shopSetting.firstOrderMinAmount)
        : ''
    );
    setUseCustomerCount(Boolean(shopSetting.useCustomerCount));
    setUseKidsCustomerCount(Boolean(shopSetting.useKidsCustomerCount));
    setIsOrderSheetTotalVisible(Boolean(shopSetting.isOrderSheetTotalVisible));
    setIsOrderCompleteTotalVisible(
      Boolean(shopSetting.isOrderCompleteTotalVisible)
    );
    setUseSinglePageMenuboard(Boolean(shopSetting.useSinglePageMenuboard));
    setMenuboardAdminPassword(shopSetting.menuboardAdminPassword ?? '');
    setIsAdminLocked(Boolean(shopSetting.isAdminLocked));
    setUseTheftPrevention(Boolean(shopSetting.useTheftPrevention));
    setUsePickupAlert(Boolean(shopSetting.usePickupAlert));
    setPickupAlertMessage(shopSetting.pickupAlertMessage ?? '');
  }, [shopSetting]);

  useEffect(() => {
    if (!isCategoryModalOpen || !shopSeq) {
      return;
    }

    refetchCategoryList();
  }, [isCategoryModalOpen, shopSeq, refetchCategoryList]);

  useEffect(() => {
    if (!categoryListResponse?.data) {
      return;
    }

    setSelectedCategorySeqs(
      categoryListResponse.data
        .filter(({ isFirstOrderRequired }) => isFirstOrderRequired)
        .map(({ categorySeq }) => categorySeq)
    );
  }, [categoryListResponse]);

  useEffect(() => {
    if (!shopTime) {
      return;
    }

    setUseBreakTime(Boolean(shopTime.useBreakTime));
    setBreakTimeLastOrderMinutes(
      numberToString(shopTime.breakTimeLastOrderTimeBefore)
    );
    setBreakTimeLastOrderAlertMinutes(
      numberToString(shopTime.breakTimeLastOrderAlertTimeBefore)
    );
    setBreakTimeMessage(shopTime.breakTimeMessage ?? '');
    setBreakTimeLastOrderMessage(shopTime.breakTimeLastOrderMessage ?? '');

    // breakTimeList를 rows로 변환
    if (shopTime.breakTimeList && shopTime.breakTimeList.length > 0) {
      const rows: BreakTimeRow[] = shopTime.breakTimeList.map((bt, index) => ({
        id: `break-time-${index}`,
        isEveryDay: false,
        startTime: bt.breakStartTime ?? '',
        endTime: bt.breakEndTime ?? '',
        selectedDays: [bt.dayOfWeek],
      }));
      setBreakTimeRows(rows);
    } else {
      setBreakTimeRows([]);
    }

    setUseClosureNotice(Boolean(shopTime.useClosure));
    setClosureLastOrderTimeBefore(
      numberToString(shopTime.closureLastOrderTimeBefore)
    );
    setClosureLastOrderMinutes(
      numberToString(shopTime.closureLastOrderAlertTimeBefore)
    );
    setClosureMessage(shopTime.closureMessage ?? '');
    setClosureLastOrderMessage(shopTime.closureLastOrderMessage ?? '');
    setClosureStartTime(shopTime.shopClosureStartTime);
    setClosureEndTime(shopTime.shopClosureEndTime);
    setClosureLastOrderTime(
      calculateTimeBefore(
        shopTime.shopClosureStartTime,
        shopTime.closureLastOrderTimeBefore
      )
    );
  }, [
    shopTime,
    setClosureEndTime,
    setClosureLastOrderTime,
    setClosureStartTime,
  ]);

  const handleToggleCategoryRequired = (categorySeq: number) => {
    setSelectedCategorySeqs((prev) =>
      prev.includes(categorySeq)
        ? prev.filter((seq) => seq !== categorySeq)
        : [...prev, categorySeq]
    );
  };

  const handleOpenCategoryModal = () => {
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };

  const handleSaveCategorySelection = () => {
    setIsCategoryModalOpen(false);
  };

  return (
    <SectionWrapper
      title="메뉴판 기능"
      icon={
        <MenuBookIcon
          width={32}
          height={32}
          color={theme.colors.primary[500]}
        />
      }
    >
      <UIStyles.setting.ContentLayout>
        <p>주문하기 사용</p>
        <ToggleButton
          size="M"
          isOn={isOrderable}
          onChange={() => setIsOrderable(!isOrderable)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>첫주문 필수 카테고리 설정</p>
        <BasicButton variant="Outline_Navy_M" onClick={handleOpenCategoryModal}>
          카테고리 설정
        </BasicButton>
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>첫주문 금액</p>
        <input
          type="text"
          value={firstOrderMinAmount}
          onChange={(event) => setFirstOrderMinAmount(event.target.value)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>객수사용</p>
        <ToggleButton
          size="M"
          isOn={useCustomerCount}
          onChange={() => setUseCustomerCount(!useCustomerCount)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>어린이 객수 사용</p>
        <ToggleButton
          size="M"
          isOn={useKidsCustomerCount}
          onChange={() => setUseKidsCustomerCount(!useKidsCustomerCount)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>주문서 합계금액 노출 여부</p>
        <ToggleButton
          size="M"
          isOn={isOrderSheetTotalVisible}
          onChange={() =>
            setIsOrderSheetTotalVisible(!isOrderSheetTotalVisible)
          }
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>주문완료 페이지 총금액 노출 여부</p>
        <ToggleButton
          size="M"
          isOn={isOrderCompleteTotalVisible}
          onChange={() =>
            setIsOrderCompleteTotalVisible(!isOrderCompleteTotalVisible)
          }
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>단일페이지 메뉴 사용</p>
        <ToggleButton
          size="M"
          isOn={useSinglePageMenuboard}
          onChange={() => setUseSinglePageMenuboard(!useSinglePageMenuboard)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>메뉴판 관리 비밀번호</p>
        <input
          type="text"
          value={menuboardAdminPassword}
          onChange={(event) => setMenuboardAdminPassword(event.target.value)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>관리잠금</p>
        <ToggleButton
          size="M"
          isOn={isAdminLocked}
          onChange={() => setIsAdminLocked(!isAdminLocked)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>도난방지 알림팝업</p>
        <ToggleButton
          size="M"
          isOn={useTheftPrevention}
          onChange={() => setUseTheftPrevention(!useTheftPrevention)}
        />
      </UIStyles.setting.ContentLayout>
      <div>
        <UIStyles.setting.ContentLayout>
          <p>픽업 메세지 사용</p>
          <ToggleButton
            size="M"
            isOn={usePickupAlert}
            onChange={() => setUsePickupAlert(!usePickupAlert)}
          />
        </UIStyles.setting.ContentLayout>
        {usePickupAlert && (
          <S.TextAreaContainer>
            <textarea
              value={pickupAlertMessage}
              onChange={(event) => setPickupAlertMessage(event.target.value)}
            />
          </S.TextAreaContainer>
        )}
      </div>
      <div>
        <UIStyles.setting.ContentLayout>
          <p>브레이크타임 사용</p>
          <ToggleButton
            size="M"
            isOn={useBreakTime}
            onChange={() => setUseBreakTime(!useBreakTime)}
          />
        </UIStyles.setting.ContentLayout>
        {useBreakTime && (
          <S.InnerSection>
            <S.BreakTimeHeader>
              <p>요일 및 시간 설정</p>
              <BasicButton
                variant="Solid_Sky_Blue_M"
                // TODO isActive 어케 쓸 건지
                onClick={() => {
                  const newRow: BreakTimeRow = {
                    id: `break-time-${Date.now()}`,
                    isEveryDay: false,
                    startTime: '',
                    endTime: '',
                    selectedDays: [],
                  };
                  setBreakTimeRows([...breakTimeRows, newRow]);
                }}
              >
                + 추가
              </BasicButton>
            </S.BreakTimeHeader>
            {breakTimeRows.map((row, index) => {
              const updateRow = (updates: Partial<BreakTimeRow>) => {
                const updated = [...breakTimeRows];
                const currentRow = updated[index];
                if (currentRow) {
                  updated[index] = { ...currentRow, ...updates };
                  setBreakTimeRows(updated);
                }
              };

              return (
                <S.BreakTimeRow key={row.id}>
                  {/* <CheckButton
                    checked={row.isEveryDay}
                    onChange={(checked) => {
                      updateRow({
                        isEveryDay: checked,
                        selectedDays: checked
                          ? DAYS.map((d) => d.value)
                          : row.selectedDays,
                      });
                    }}
                    customStyle={S.CheckButtonCustomStyle}
                  >
                    매일
                  </CheckButton> */}
                  <S.TimeDisplay>
                    <S.TimeSelectWrapper>
                      <Dropdown
                        options={TIME_OPTIONS}
                        value={row.startTime || null}
                        onChange={(value) => {
                          updateRow({ startTime: String(value) });
                        }}
                        customStyle={S.TimeDropdownStyle}
                      />
                    </S.TimeSelectWrapper>
                    <span>-</span>
                    <S.TimeSelectWrapper>
                      <Dropdown
                        options={TIME_OPTIONS}
                        value={row.endTime || null}
                        onChange={(value) => {
                          updateRow({ endTime: String(value) });
                        }}
                        customStyle={S.TimeDropdownStyle}
                      />
                    </S.TimeSelectWrapper>
                  </S.TimeDisplay>
                  <S.DayCheckboxes>
                    {DAYS.map((day) => {
                      // 다른 row에서 해당 요일이 선택되어 있는지 확인
                      const isDaySelectedInOtherRows = breakTimeRows.some(
                        (otherRow, otherIndex) =>
                          otherIndex !== index &&
                          otherRow.selectedDays.includes(day.value)
                      );
                      // 현재 row에서 이미 선택된 요일이 아니고, 다른 row에서 선택된 경우 비활성화
                      const isDisabled =
                        !row.selectedDays.includes(day.value) &&
                        isDaySelectedInOtherRows;

                      const isChecked = row.selectedDays.includes(day.value);

                      return (
                        <CheckButton
                          key={day.value}
                          checked={isChecked}
                          disabled={isDisabled}
                          customStyle={
                            isDisabled
                              ? S.DisabledDayCheckboxStyle
                              : isChecked
                                ? undefined
                                : S.DayCheckboxStyle
                          }
                          onChange={(checked) => {
                            if (checked) {
                              updateRow({
                                selectedDays: [...row.selectedDays, day.value],
                              });
                            } else {
                              updateRow({
                                selectedDays: row.selectedDays.filter(
                                  (d) => d !== day.value
                                ),
                                isEveryDay: false,
                              });
                            }
                          }}
                        >
                          {day.label}
                        </CheckButton>
                      );
                    })}
                  </S.DayCheckboxes>
                  <BasicButton
                    variant="Outline_Grey_M"
                    onClick={() => {
                      setBreakTimeRows(
                        breakTimeRows.filter((r) => r.id !== row.id)
                      );
                    }}
                    customStyle={S.DeleteButtonCustomStyle}
                  >
                    <DeleteIcon
                      width={16}
                      height={16}
                      color={theme.colors.grey[600]}
                    />
                  </BasicButton>
                </S.BreakTimeRow>
              );
            })}
            <S.InnerSectionItem style={{ marginTop: '24px' }}>
              <p>주문 마감 안내 시간</p>
              <S.ClickableText>
                <div>
                  <input
                    type="number"
                    onChange={(event) =>
                      setBreakTimeLastOrderAlertMinutes(
                        normalizeNumberString(event.target.value)
                      )
                    }
                    value={breakTimeLastOrderAlertMinutes || '0'}
                  />
                  분
                </div>
                전 알림
              </S.ClickableText>
            </S.InnerSectionItem>
            <S.InnerSectionItem>
              <p>라스트오더 가능 시간</p>
              <S.ClickableText>
                <div>
                  <input
                    type="number"
                    onChange={(event) =>
                      setBreakTimeLastOrderMinutes(
                        normalizeNumberString(event.target.value)
                      )
                    }
                    value={breakTimeLastOrderMinutes || '0'}
                  />
                  분
                </div>
                전 까지
              </S.ClickableText>
            </S.InnerSectionItem>
            <S.TextAreasContainer>
              <div>
                <p>라스트오더 안내 메세지</p>
                <textarea
                  value={breakTimeLastOrderMessage}
                  onChange={(event) =>
                    setBreakTimeLastOrderMessage(event.target.value)
                  }
                />
              </div>
              <div>
                <p>브레이크타임 안내 메세지</p>
                <textarea
                  value={breakTimeMessage}
                  onChange={(event) => setBreakTimeMessage(event.target.value)}
                />
              </div>
            </S.TextAreasContainer>
          </S.InnerSection>
        )}
      </div>

      <div>
        <UIStyles.setting.ContentLayout>
          <p>영업마감안내 사용</p>
          <ToggleButton
            size="M"
            isOn={useClosureNotice}
            onChange={() => setUseClosureNotice(!useClosureNotice)}
          />
        </UIStyles.setting.ContentLayout>
        {useClosureNotice && (
          <S.InnerSection>
            <S.InnerSectionItem>
              <p>시간 설정</p>
              <UIStyles.setting.TimeRangeInput>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={closureStartTime.hour}
                  onChange={closureStartTime.handleHourChange}
                  maxLength={2}
                />
                <span>:</span>
                <input
                  ref={closureStartTime.minuteRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={closureStartTime.minute}
                  onChange={closureStartTime.handleMinuteChange}
                  onKeyDown={closureStartTime.handleMinuteKeyDown}
                  maxLength={2}
                />
                <span>-</span>
                <input
                  ref={closureEndHourRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={closureEndTime.hour}
                  onChange={closureEndTime.handleHourChange}
                  maxLength={2}
                />
                <span>:</span>
                <input
                  ref={closureEndTime.minuteRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={closureEndTime.minute}
                  onChange={closureEndTime.handleMinuteChange}
                  onKeyDown={closureEndTime.handleMinuteKeyDown}
                  maxLength={2}
                />
              </UIStyles.setting.TimeRangeInput>
            </S.InnerSectionItem>
            <S.InnerSectionItem>
              <p>주문 마감 안내 시간</p>

              <S.ClickableText>
                <div>
                  <input
                    type="number"
                    onChange={(event) =>
                      setClosureLastOrderTimeBefore(
                        normalizeNumberString(event.target.value)
                      )
                    }
                    value={closureLastOrderTimeBefore || '0'}
                  />
                  분
                </div>
                전 알림
              </S.ClickableText>
            </S.InnerSectionItem>
            <S.InnerSectionItem>
              <p>라스트 오더 알림</p>

              <S.ClickableText>
                <div>
                  <input
                    type="number"
                    onChange={(event) =>
                      setClosureLastOrderMinutes(
                        normalizeNumberString(event.target.value)
                      )
                    }
                    value={closureLastOrderMinutes || '0'}
                  />
                  분
                </div>
                전 까지
              </S.ClickableText>
            </S.InnerSectionItem>
            <S.TextAreasContainer>
              <div>
                <p>주문 마감 사전 안내 메세지</p>
                <textarea
                  value={closureLastOrderMessage}
                  onChange={(event) =>
                    setClosureLastOrderMessage(event.target.value)
                  }
                />
              </div>
              <div>
                <p>영업마감 안내 메세지</p>
                <textarea
                  value={closureMessage}
                  onChange={(event) => setClosureMessage(event.target.value)}
                />
              </div>
            </S.TextAreasContainer>
          </S.InnerSection>
        )}
      </div>
      <CategoryModal
        isOpen={isCategoryModalOpen}
        categories={categoryListResponse?.data ?? []}
        selectedCategorySeqs={selectedCategorySeqs}
        isLoading={isCategoryListLoading}
        onClose={handleCloseCategoryModal}
        onToggle={handleToggleCategoryRequired}
        onSave={handleSaveCategorySelection}
      />
    </SectionWrapper>
  );
};

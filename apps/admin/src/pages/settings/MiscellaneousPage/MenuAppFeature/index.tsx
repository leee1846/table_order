import { useAdminTranslation } from '@/config/i18n';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ICategory, IShopSetting, IShopTime } from '@repo/api/types';
import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import {
  BasicButton,
  CheckButton,
  Dropdown,
  ToggleButton,
} from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/MenuAppFeature/menuAppFeature.style';
import { useTimeInput } from '@/hooks/useTimeInput';
import { theme } from '@repo/ui';
import { DeleteIcon, MenuBookIcon } from '@repo/ui/icons';
import { CategoryModal } from './CategoryModal';
import { getDays } from '@/constants/days';
import {
  allowOnlyNumbers,
  formatCurrency,
  clampNumericToMax,
} from '@repo/util/string';
import { generateTimeOptions, calculateTimeBefore } from '@repo/util/time';
import { MAX_DESCRIPTION_LENGTH } from '@repo/util/constants';
import type { MiscellaneousChange } from '@/pages/settings/MiscellaneousPage/types';
import { CapacitorApp } from '@repo/util/app';
import { toast } from '@repo/feature/utils';

interface MenuAppFeatureProps {
  shopSetting?: IShopSetting;
  shopTime?: IShopTime;
  categories: ICategory[];
  isCategoryListLoading: boolean;
  onRefreshCategories: () => void;
  onChange?: (value: MiscellaneousChange) => void;
}

interface BreakTimeRow {
  id: string;
  isEveryDay: boolean;
  startTime: string;
  endTime: string;
  selectedDays: number[];
}

const TIME_OPTIONS = generateTimeOptions();

/** 첫주문 금액 입력 최대값 (999,999,999원) */
const MAX_FIRST_ORDER_MIN_AMOUNT = 999999999;

export const MenuAppFeature = ({
  shopSetting,
  shopTime,
  categories,
  isCategoryListLoading,
  onRefreshCategories,
  onChange,
}: MenuAppFeatureProps) => {
  const { t } = useAdminTranslation();
  const days = useMemo(() => getDays(t), [t]);
  const dayValues = useMemo(() => days.map(({ value }) => value), [days]);
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
  const [useTableOverlapping, setUseTableOverlapping] = useState(false);

  const shopSeq = shopSetting?.shopSeq;

  const [useBreakTime, setUseBreakTime] = useState(false);
  const [breakTimeRows, setBreakTimeRows] = useState<BreakTimeRow[]>([]);
  const [breakTimeLastOrderTimeBefore, setBreakTimeLastOrderTimeBefore] =
    useState('');
  const [
    breakTimeLastOrderAlertTimeBefore,
    setBreakTimeLastOrderAlertTimeBefore,
  ] = useState('');
  const [breakTimeMessage, setBreakTimeMessage] = useState('');
  const [breakTimeLastOrderMessage, setBreakTimeLastOrderMessage] =
    useState('');

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

  const [useClosureNotice, setUseClosureNotice] = useState(false);
  const [closureLastOrderTimeBefore, setClosureLastOrderTimeBefore] =
    useState('');
  const [closureLastOrderMinutes, setClosureLastOrderMinutes] = useState('');
  const [closureLastOrderMessage, setClosureLastOrderMessage] = useState('');
  const [closureMessage, setClosureMessage] = useState('');
  // 시간과 분을 HHMM 형식의 문자열로 변환
  const toTimeString = (hour: string, minute: string) =>
    hour && minute
      ? `${hour.padStart(2, '0')}${minute.padStart(2, '0')}`
      : undefined;

  // 문자열을 숫자로 변환, 빈 문자열이거나 숫자가 아니면 0 반환
  const toNumberOrUndefined = (value: string) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

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
    setUseTableOverlapping(Boolean(shopSetting.useTableOverlapping));
  }, [shopSetting]);

  useEffect(() => {
    if (!isCategoryModalOpen || !shopSeq) {
      return;
    }

    onRefreshCategories();
  }, [isCategoryModalOpen, onRefreshCategories, shopSeq]);

  useEffect(() => {
    setSelectedCategorySeqs(
      categories
        .filter(({ isFirstOrderRequired }) => isFirstOrderRequired)
        .map(({ categorySeq }) => categorySeq)
    );
  }, [categories]);

  useEffect(() => {
    if (!shopTime) {
      return;
    }

    setUseBreakTime(Boolean(shopTime.useBreakTime));
    setBreakTimeLastOrderAlertTimeBefore(
      String(shopTime.breakTimeLastOrderAlertTimeBefore ?? '')
    );
    setBreakTimeLastOrderTimeBefore(
      String(shopTime.breakTimeLastOrderTimeBefore ?? '')
    );
    setBreakTimeMessage(shopTime.breakTimeMessage ?? '');
    setBreakTimeLastOrderMessage(shopTime.breakTimeLastOrderMessage ?? '');

    // breakTimeList를 rows로 변환 (같은 시간대는 합쳐서 처리)
    if (shopTime.breakTimeList && shopTime.breakTimeList.length > 0) {
      // 시간대별로 그룹화 (startTime-endTime을 키로 사용)
      const timeGroupMap = new Map<string, number[]>();

      shopTime.breakTimeList.forEach((bt) => {
        const timeKey = `${bt.breakStartTime ?? ''}-${bt.breakEndTime ?? ''}`;
        if (!timeGroupMap.has(timeKey)) {
          timeGroupMap.set(timeKey, []);
        }
        timeGroupMap.get(timeKey)?.push(bt.dayOfWeek);
      });

      // 그룹화된 데이터를 rows로 변환
      const rows: BreakTimeRow[] = Array.from(timeGroupMap.entries()).map(
        ([timeKey, groupedDays], index) => {
          const [startTime, endTime] = timeKey.split('-');
          const isEveryDay =
            dayValues.length > 0 &&
            dayValues.every((day) => groupedDays.includes(day));
          return {
            id: `break-time-${index}`,
            isEveryDay,
            startTime: startTime ?? '',
            endTime: endTime ?? '',
            selectedDays: groupedDays,
          };
        }
      );
      setBreakTimeRows(rows);
    } else {
      setBreakTimeRows([]);
    }

    setUseClosureNotice(Boolean(shopTime.useClosure));
    setClosureLastOrderTimeBefore(
      String(shopTime.closureLastOrderAlertTimeBefore ?? '')
    );
    setClosureLastOrderMinutes(
      String(shopTime.closureLastOrderTimeBefore ?? '')
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
    dayValues,
    setClosureEndTime,
    setClosureLastOrderTime,
    setClosureStartTime,
  ]);

  useEffect(() => {
    if (!onChange) {
      return;
    }

    const breakTimeList = breakTimeRows
      .filter((row) => row.startTime && row.endTime)
      .flatMap((row) =>
        row.selectedDays.map((day) => ({
          shopSeq: shopSeq ?? shopTime?.shopSeq ?? 0,
          dayOfWeek: day as 0 | 1 | 2 | 3 | 4 | 5 | 6,
          breakStartTime: row.startTime,
          breakEndTime: row.endTime,
        }))
      );

    const shopSettingChanges: Partial<IShopSetting> = {
      shopSeq,
      isMenuboardOrderable: isOrderable,
      useCustomerCount,
      useKidsCustomerCount,
      isOrderSheetTotalVisible,
      isOrderCompleteTotalVisible,
      useSinglePageMenuboard,
      isAdminLocked,
      useTheftPrevention,
      usePickupAlert,
      pickupAlertMessage,
      useTableOverlapping,
    };

    const firstOrderMinAmountValue = toNumberOrUndefined(firstOrderMinAmount);

    if (firstOrderMinAmountValue !== undefined) {
      shopSettingChanges.firstOrderMinAmount = firstOrderMinAmountValue;
    }

    shopSettingChanges.menuboardAdminPassword = menuboardAdminPassword !== '' ? menuboardAdminPassword : undefined;

    const closureStart = toTimeString(
      closureStartTime.hour,
      closureStartTime.minute
    );
    const closureEnd = toTimeString(closureEndTime.hour, closureEndTime.minute);

    const shopTimeChanges: Partial<IShopTime> = {
      shopSeq,
      useBreakTime,
      breakTimeList,
      breakTimeLastOrderTimeBefore: toNumberOrUndefined(
        breakTimeLastOrderTimeBefore
      ),
      breakTimeLastOrderAlertTimeBefore: toNumberOrUndefined(
        breakTimeLastOrderAlertTimeBefore
      ),
      breakTimeMessage,
      breakTimeLastOrderMessage,
      useClosure: useClosureNotice,
      closureLastOrderTimeBefore: toNumberOrUndefined(closureLastOrderMinutes),
      closureLastOrderAlertTimeBefore: toNumberOrUndefined(
        closureLastOrderTimeBefore
      ),
      closureMessage,
      closureLastOrderMessage,
    };

    shopTimeChanges.shopClosureStartTime = closureStart;
    shopTimeChanges.shopClosureEndTime = closureEnd;

    onChange({
      shopSetting: shopSettingChanges,
      shopTime: shopTimeChanges,
      selectedCategorySeqs,
    });
  }, [
    breakTimeLastOrderAlertTimeBefore,
    breakTimeLastOrderMessage,
    breakTimeLastOrderTimeBefore,
    breakTimeMessage,
    breakTimeRows,
    closureEndTime.hour,
    closureEndTime.minute,
    closureLastOrderMessage,
    closureLastOrderMinutes,
    closureLastOrderTimeBefore,
    closureMessage,
    closureStartTime.hour,
    closureStartTime.minute,
    firstOrderMinAmount,
    isAdminLocked,
    isOrderCompleteTotalVisible,
    isOrderSheetTotalVisible,
    isOrderable,
    menuboardAdminPassword,
    onChange,
    pickupAlertMessage,
    selectedCategorySeqs,
    shopSeq,
    shopTime?.shopSeq,
    useBreakTime,
    useClosureNotice,
    useCustomerCount,
    useKidsCustomerCount,
    usePickupAlert,
    useSinglePageMenuboard,
    useTableOverlapping,
    useTheftPrevention,
  ]);

  // 카테고리의 첫주문 필수 여부를 토글
  const handleToggleCategoryRequired = (categorySeq: number) => {
    setSelectedCategorySeqs((prev) =>
      prev.includes(categorySeq)
        ? prev.filter((seq) => seq !== categorySeq)
        : [...prev, categorySeq]
    );
  };

  // 카테고리 설정 모달 열기
  const handleOpenCategoryModal = () => {
    setIsCategoryModalOpen(true);
  };

  // 카테고리 설정 모달 닫기
  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };

  return (
    <SectionWrapper
      title={t('메뉴판 기능')}
      icon={
        <MenuBookIcon
          width={32}
          height={32}
          color={theme.colors.primary[500]}
        />
      }
    >
      <UIStyles.setting.ContentLayout>
        <p>{t('주문하기 사용')}</p>
        <ToggleButton
          size="M"
          isOn={isOrderable}
          onChange={() => setIsOrderable(!isOrderable)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>{t('첫주문 필수 카테고리 설정')}</p>
        <BasicButton variant="Outline_Navy_M" onClick={handleOpenCategoryModal}>
          {t('카테고리 설정')}
        </BasicButton>
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>{t('첫주문 금액')}</p>
        <input
          inputMode="numeric"
          value={
            firstOrderMinAmount === ''
              ? ''
              : formatCurrency(Number(firstOrderMinAmount))
          }
          onChange={(event) => {
            const value = event.target.value;
            const numericStr = allowOnlyNumbers(value);
            if (numericStr.length === 0) {
              setFirstOrderMinAmount('');
            } else {
              setFirstOrderMinAmount(
                String(clampNumericToMax(value, MAX_FIRST_ORDER_MIN_AMOUNT))
              );
            }
          }}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>{t('객수사용')}</p>
        <ToggleButton
          size="M"
          isOn={useCustomerCount}
          onChange={() => {
            const next = !useCustomerCount;
            setUseCustomerCount(next);
            if (!next) {
              setUseKidsCustomerCount(false);
            }
          }}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>{t('어린이 객수 사용')}</p>
        <ToggleButton
          size="M"
          isOn={useKidsCustomerCount}
          onChange={() => {
            const next = !useKidsCustomerCount;
            if (next && !useCustomerCount) {
              toast(t('객수 사용을 활성화 해주세요.'));
              return;
            }
            setUseKidsCustomerCount(next);
          }}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>{t('주문서 합계금액 노출 여부')}</p>
        <ToggleButton
          size="M"
          isOn={isOrderSheetTotalVisible}
          onChange={() =>
            setIsOrderSheetTotalVisible(!isOrderSheetTotalVisible)
          }
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>{t('주문완료 페이지 총금액 노출 여부')}</p>
        <ToggleButton
          size="M"
          isOn={isOrderCompleteTotalVisible}
          onChange={() =>
            setIsOrderCompleteTotalVisible(!isOrderCompleteTotalVisible)
          }
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>{t('단일페이지 메뉴 사용')}</p>
        <ToggleButton
          size="M"
          isOn={useSinglePageMenuboard}
          onChange={() => setUseSinglePageMenuboard(!useSinglePageMenuboard)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>{t('메뉴판 관리 비밀번호(4자리)')}</p>
        <input
          type="password"
          value={menuboardAdminPassword}
          maxLength={4}
          placeholder=""
          onChange={(event) => {
            const value = event.target.value.replace(/\D/g, '').slice(0, 4);
            setMenuboardAdminPassword(value);
          }}
          inputMode="numeric"
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>{t('관리잠금')}</p>
        <ToggleButton
          size="M"
          isOn={isAdminLocked}
          onChange={() => {
            if (CapacitorApp.isNative()) {
              toast(t('관리자 웹에서 변경해주세요.'));
              return;
            }
            setIsAdminLocked(!isAdminLocked);
          }}
          customStyle={
            CapacitorApp.isNative()
              ? S.getNativeToggleButtonStyle(isAdminLocked)
              : undefined
          }
        />
      </UIStyles.setting.ContentLayout>
      {/* <UIStyles.setting.ContentLayout>
        <p>{t('도난방지 알림팝업')}</p>
        <ToggleButton
          size="M"
          isOn={useTheftPrevention}
          onChange={() => setUseTheftPrevention(!useTheftPrevention)}
        />
      </UIStyles.setting.ContentLayout> */}
      <UIStyles.setting.ContentLayout>
        <p>{t('테이블 중복 사용 허용')}</p>
        <ToggleButton
          size="M"
          isOn={useTableOverlapping}
          onChange={() => setUseTableOverlapping(!useTableOverlapping)}
        />
      </UIStyles.setting.ContentLayout>
      <div>
        <UIStyles.setting.ContentLayout>
          <p>{t('픽업 메세지 사용')}</p>
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
              maxLength={MAX_DESCRIPTION_LENGTH}
              placeholder={t('메뉴가 나왔으니 가지고 가십시오.')}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= MAX_DESCRIPTION_LENGTH) {
                  setPickupAlertMessage(value);
                }
              }}
            />
          </S.TextAreaContainer>
        )}
      </div>
      <div>
        <UIStyles.setting.ContentLayout>
          <p>{t('브레이크타임 사용')}</p>
          <ToggleButton
            size="M"
            isOn={useBreakTime}
            onChange={() => setUseBreakTime(!useBreakTime)}
          />
        </UIStyles.setting.ContentLayout>
        {useBreakTime && (
          <S.InnerSection>
            <S.BreakTimeHeader>
              <p>{t('요일 및 시간 설정')}</p>
              <BasicButton
                variant="Solid_Sky_Blue_M"
                onClick={() => {
                  const hasAnyRows = breakTimeRows.length > 0;
                  const newRow: BreakTimeRow = {
                    id: `break-time-${Date.now()}`,
                    isEveryDay: !hasAnyRows,
                    startTime: '',
                    endTime: '',
                    selectedDays: !hasAnyRows ? dayValues : [],
                  };
                  setBreakTimeRows([...breakTimeRows, newRow]);
                }}
              >
                {t('+ 추가')}
              </BasicButton>
            </S.BreakTimeHeader>
            {breakTimeRows.map((row, index) => {
              // 브레이크타임 row의 특정 필드 업데이트
              const updateRow = (updates: Partial<BreakTimeRow>) => {
                const updated = [...breakTimeRows];
                const currentRow = updated[index];
                if (currentRow) {
                  updated[index] = { ...currentRow, ...updates };
                  setBreakTimeRows(updated);
                }
              };
              const otherRowsSelectedDays = breakTimeRows
                .filter((_, rowIndex) => rowIndex !== index)
                .flatMap((otherRow) => otherRow.selectedDays);
              const hasAllDaysSelected = dayValues.every((day) =>
                row.selectedDays.includes(day)
              );
              const isEveryDayDisabled =
                otherRowsSelectedDays.length > 0 && !hasAllDaysSelected;

              return (
                <S.BreakTimeRow key={row.id}>
                  <CheckButton
                    checked={row.isEveryDay}
                    disabled={isEveryDayDisabled}
                    onChange={(checked) => {
                      if (isEveryDayDisabled) {
                        return;
                      }

                      updateRow({
                        isEveryDay: checked,
                        selectedDays: checked ? dayValues : row.selectedDays,
                      });
                    }}
                    customStyle={S.CheckButtonCustomStyle}
                  >
                    {t('매일')}
                  </CheckButton>
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
                    {days.map((day) => {
                      // 다른 row에서 해당 요일이 선택되어 있는지 확인
                      const isDaySelectedInOtherRows =
                        otherRowsSelectedDays.includes(day.value);
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
              <p>{t('주문 마감 안내 시간')}</p>
              <S.ClickableText>
                <div>
                  <input
                    inputMode="numeric"
                    onChange={(event) =>
                      setBreakTimeLastOrderAlertTimeBefore(
                        allowOnlyNumbers(event.target.value)
                      )
                    }
                    value={breakTimeLastOrderAlertTimeBefore}
                    placeholder="0"
                    maxLength={3}
                  />
                  {t('분')}
                </div>
                {t('전 알림')}
              </S.ClickableText>
            </S.InnerSectionItem>
            <S.InnerSectionItem>
              <p>{t('라스트오더 가능 시간')}</p>
              <S.ClickableText>
                <div>
                  <input
                    inputMode="numeric"
                    placeholder="0"
                    onChange={(event) =>
                      setBreakTimeLastOrderTimeBefore(
                        allowOnlyNumbers(event.target.value)
                      )
                    }
                    value={breakTimeLastOrderTimeBefore}
                    maxLength={3}
                  />
                  {t('분')}
                </div>
                {t('전 까지')}
              </S.ClickableText>
            </S.InnerSectionItem>
            <S.TextAreasContainer>
              <div>
                <p>{t('라스트오더 안내 메세지')}</p>
                <textarea
                  value={breakTimeLastOrderMessage}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value.length <= MAX_DESCRIPTION_LENGTH) {
                      setBreakTimeLastOrderMessage(value);
                    }
                  }}
                />
              </div>
              <div>
                <p>{t('브레이크타임 안내 메세지')}</p>
                <textarea
                  value={breakTimeMessage}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value.length <= MAX_DESCRIPTION_LENGTH) {
                      setBreakTimeMessage(value);
                    }
                  }}
                />
              </div>
            </S.TextAreasContainer>
          </S.InnerSection>
        )}
      </div>

      <div>
        <UIStyles.setting.ContentLayout>
          <p>{t('영업마감안내 사용')}</p>
          <ToggleButton
            size="M"
            isOn={useClosureNotice}
            onChange={() => setUseClosureNotice(!useClosureNotice)}
          />
        </UIStyles.setting.ContentLayout>
        {useClosureNotice && (
          <S.InnerSection>
            <S.InnerSectionItem>
              <p>{t('시간 설정')}</p>
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
              <p>{t('주문 마감 안내 시간')}</p>

              <S.ClickableText>
                <div>
                  <input
                    placeholder="0"
                    inputMode="numeric"
                    onChange={(event) =>
                      setClosureLastOrderTimeBefore(
                        allowOnlyNumbers(event.target.value)
                      )
                    }
                    value={closureLastOrderTimeBefore}
                    maxLength={3}
                  />
                  {t('분')}
                </div>
                {t('전 알림')}
              </S.ClickableText>
            </S.InnerSectionItem>
            <S.InnerSectionItem>
              <p>{t('라스트 오더 알림')}</p>

              <S.ClickableText>
                <div>
                  <input
                    placeholder="0"
                    inputMode="numeric"
                    onChange={(event) =>
                      setClosureLastOrderMinutes(
                        allowOnlyNumbers(event.target.value)
                      )
                    }
                    value={closureLastOrderMinutes}
                    maxLength={3}
                  />
                  {t('분')}
                </div>
                {t('전 까지')}
              </S.ClickableText>
            </S.InnerSectionItem>
            <S.TextAreasContainer>
              <div>
                <p>{t('주문 마감 사전 안내 메세지')}</p>
                <textarea
                  value={closureLastOrderMessage}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value.length <= MAX_DESCRIPTION_LENGTH) {
                      setClosureLastOrderMessage(value);
                    }
                  }}
                />
              </div>
              <div>
                <p>{t('영업마감 안내 메세지')}</p>
                <textarea
                  value={closureMessage}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value.length <= MAX_DESCRIPTION_LENGTH) {
                      setClosureMessage(value);
                    }
                  }}
                />
              </div>
            </S.TextAreasContainer>
          </S.InnerSection>
        )}
      </div>
      <CategoryModal
        isOpen={isCategoryModalOpen}
        categories={categories}
        selectedCategorySeqs={selectedCategorySeqs}
        isLoading={isCategoryListLoading}
        onClose={handleCloseCategoryModal}
        onCheck={handleToggleCategoryRequired}
      />
    </SectionWrapper>
  );
};

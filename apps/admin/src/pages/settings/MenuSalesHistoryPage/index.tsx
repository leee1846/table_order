import { useEffect, useMemo, useState } from 'react';
import { Calender, BasicButton } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { toast } from '@repo/feature/utils';
import { useAdminTranslation } from '@/config/i18n';
import {
  formatDateTime,
  getDateRangeByPreset,
  toYYYYMMDDRange,
} from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import { useGetMenuSalesHistory } from '@repo/api/queries';
import { MenuSalesHistoryTable } from './Table';
import * as S from './menuSalesHistoryPage.style';

export const MenuSalesHistoryPage = () => {
  const { t } = useAdminTranslation();
  const { shopCode } = useAuth();
  const defaultRange = useMemo(() => getDateRangeByPreset('today'), []);

  const [startDate, setStartDate] = useState<string>(defaultRange.startDate);
  const [endDate, setEndDate] = useState<string>(defaultRange.endDate);
  const [appliedRange, setAppliedRange] = useState(defaultRange);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { startDate: apiStartDate, endDate: apiEndDate } = useMemo(
    () =>
      toYYYYMMDDRange({
        startDate: appliedRange.startDate,
        endDate: appliedRange.endDate,
      }),
    [appliedRange]
  );

  const { data: menuSalesHistoryResponse, isFetching } = useGetMenuSalesHistory(
    {
      shopCode: shopCode ?? '',
      startDate: apiStartDate,
      endDate: apiEndDate,
    },
    {
      enabled: !!shopCode && !!apiStartDate && !!apiEndDate,
    }
  );

  const historyItems = menuSalesHistoryResponse?.data ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    historyItems.forEach((item) => {
      if (item.categoryName) {
        set.add(item.categoryName);
      }
    });
    return Array.from(set);
  }, [historyItems]);

  useEffect(() => {
    if (categories.length && selectedCategories.length === 0) {
      setSelectedCategories(categories);
    }
  }, [categories, selectedCategories.length]);

  const filteredItems = useMemo(() => {
    if (!selectedCategories.length) return historyItems;
    return historyItems.filter((item) =>
      selectedCategories.includes(item.categoryName ?? '')
    );
  }, [historyItems, selectedCategories]);

  const handleSelectDate = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setShowCalendar(false);
  };

  const handleSearch = () => {
    if (!startDate || !endDate) return;
    setAppliedRange({ startDate, endDate });
  };

  const handleDownload = () => {
    toast(t('내역 다운로드 준비 중입니다.'));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedCategories(checked ? categories : []);
  };

  const formatCalendarText = (date: string) => {
    if (!date) return t('날짜 선택');
    return formatDateTime(date, 'YYYY년 MM월 DD일');
  };

  const allSelected =
    categories.length > 0 && selectedCategories.length === categories.length;

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Title>
            {t('매출 관리')}
            <div /> <span>{t('메뉴별 매출내역')}</span>
          </S.Title>

          <S.FilterBar>
            <S.DateRange>
              <S.DateButton type="button" onClick={() => setShowCalendar(true)}>
                <CalendarMonthIcon
                  width={28}
                  height={28}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(startDate)}</S.DateText>
              </S.DateButton>

              <S.RangeDivider>~</S.RangeDivider>

              <S.DateButton type="button" onClick={() => setShowCalendar(true)}>
                <CalendarMonthIcon
                  width={28}
                  height={28}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(endDate)}</S.DateText>
              </S.DateButton>

              <S.SearchButton
                type="button"
                onClick={handleSearch}
                disabled={!startDate || !endDate}
              >
                {t('조회')}
              </S.SearchButton>
            </S.DateRange>

            <S.Actions>
              <BasicButton
                variant="Solid_Navy_M"
                onClick={handleDownload}
                disabled={!shopCode}
              >
                {t('내역 다운로드')}
              </BasicButton>
            </S.Actions>
          </S.FilterBar>

          <S.CategoryFilter>
            <S.CategoryHeader>
              <S.SelectAll>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                {t('카테고리 전체선택')}
              </S.SelectAll>
            </S.CategoryHeader>
            <S.CategoryChips>
              {categories.map((category) => (
                <S.Chip
                  key={category}
                  type="button"
                  selected={selectedCategories.includes(category)}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </S.Chip>
              ))}
            </S.CategoryChips>
          </S.CategoryFilter>

          <S.TableCard>
            <MenuSalesHistoryTable
              rows={filteredItems}
              isLoading={isFetching}
            />
          </S.TableCard>
        </S.Container>
      </UIStyles.setting.TablePageContainer>

      {showCalendar && (
        <Calender
          type="range"
          onClose={() => setShowCalendar(false)}
          startDate={startDate}
          endDate={endDate}
          onSelectDate={handleSelectDate}
          beforeYears={1}
          afterYears={1}
        />
      )}
    </>
  );
};

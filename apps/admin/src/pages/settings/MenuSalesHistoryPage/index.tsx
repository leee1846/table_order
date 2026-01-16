import { useEffect, useMemo, useState } from 'react';
import { Calender, BasicButton } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { useAdminTranslation } from '@/config/i18n';
import adminI18n from '@/config/i18n';
import { getDateRangeByPreset, toYYYYMMDDRange } from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import { useGetMenuSalesHistory, useGetCategoryList } from '@repo/api/queries';
import { MenuSalesHistoryTable } from './Table';
import * as S from './menuSalesHistoryPage.style';

export const MenuSalesHistoryPage = () => {
  const { t } = useAdminTranslation();
  const { shopCode, shopSeq } = useAuth();
  const defaultRange = useMemo(() => getDateRangeByPreset('today'), []);

  const [startDate, setStartDate] = useState<string>(defaultRange.startDate);
  const [endDate, setEndDate] = useState<string>(defaultRange.endDate);
  const [appliedRange, setAppliedRange] = useState(defaultRange);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // 1단계: 카테고리 리스트 먼저 가져오기
  const { data: categoryListResponse } = useGetCategoryList(
    {
      shopSeq: shopSeq ?? 0,
    },
    {
      enabled: !!shopSeq,
    }
  );

  const categories = useMemo(() => {
    const categoryList = categoryListResponse?.data ?? [];
    return categoryList.map((category) => category.categoryName);
  }, [categoryListResponse]);

  // 처음 카테고리 로드 시 전체 선택
  useEffect(() => {
    if (categories.length > 0 && selectedCategories.length === 0) {
      setSelectedCategories(categories);
    }
  }, [categories, selectedCategories.length]);

  // 2단계: 카테고리 로드 후 매출 데이터 가져오기
  const { startDate: apiStartDate, endDate: apiEndDate } = useMemo(
    () =>
      toYYYYMMDDRange({
        startDate: appliedRange.startDate,
        endDate: appliedRange.endDate,
      }),
    [appliedRange]
  );

  const { data: menuSalesHistoryResponse } = useGetMenuSalesHistory(
    {
      shopCode: shopCode ?? '',
      startDate: apiStartDate,
      endDate: apiEndDate,
    },
    {
      enabled:
        !!shopCode && !!apiStartDate && !!apiEndDate && categories.length > 0,
    }
  );

  const historyItems = menuSalesHistoryResponse?.data ?? [];

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

  // const handleDownload = () => {
  //   toast(t('내역 다운로드 준비 중입니다.'));
  // };

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
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}${t('년도')} ${month}${t('월_날짜')} ${day}${t('일_날짜')}`;
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
            <S.Actions>
              {/* <BasicButton
                variant="Solid_Navy_M"
                onClick={handleDownload}
                disabled={!shopCode}
              >
                {t('내역 다운로드')}
              </BasicButton> */}
            </S.Actions>
            <S.DateRange>
              <S.DateButton type="button" onClick={() => setShowCalendar(true)}>
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(startDate)}</S.DateText>
              </S.DateButton>

              <S.RangeDivider>~</S.RangeDivider>

              <S.DateButton type="button" onClick={() => setShowCalendar(true)}>
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>{formatCalendarText(endDate)}</S.DateText>
              </S.DateButton>
            </S.DateRange>

            <BasicButton
              variant="Solid_Navy_L"
              onClick={handleSearch}
              disabled={!startDate || !endDate}
            >
              {t('조회')}
            </BasicButton>
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
            <MenuSalesHistoryTable rows={filteredItems} />
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
          i18nInstance={adminI18n}
        />
      )}
    </>
  );
};

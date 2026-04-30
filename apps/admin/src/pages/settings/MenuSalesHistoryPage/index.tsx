import { useEffect, useMemo, useRef, useState } from 'react';
import { AntTooltip } from '@/feature/backoffice/components';
import {
  Calender,
  BasicButton,
  CheckButton,
  Dropdown,
} from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { toast } from '@repo/feature/utils';
import adminI18n, { useAdminTranslation } from '@/config/i18n';
import {
  getDateRangeByPreset,
  toYYYYMMDDRange,
  isStartDateAfterEndDate,
  isEndDateBeforeStartDate,
  formatLocalizedDate,
} from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import { useGetCategoryList, useGetMenuSalesHistory } from '@repo/api/queries';
import { MenuSalesHistoryTable } from './Table';
import * as S from './menuSalesHistoryPage.style';
import type { TShopLanguage } from '@repo/api/types';

/** 미분류 칩·매출 행(categoryName 없음) 필터용 sentinel (실제 categorySeq와 충돌 없음) */
const UNCATEGORIZED_CATEGORY_SEQ = -1;

export const MenuSalesHistoryPage = () => {
  const { t, i18n } = useAdminTranslation();
  const { shopCode, shopSeq } = useAuth();
  const defaultRange = useMemo(() => getDateRangeByPreset('today'), []);

  const [startDate, setStartDate] = useState<string>(defaultRange.startDate);
  const [endDate, setEndDate] = useState<string>(defaultRange.endDate);
  const [appliedRange, setAppliedRange] = useState(defaultRange);
  const [showStartCalendar, setShowStartCalendar] = useState<boolean>(false);
  const [showEndCalendar, setShowEndCalendar] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const hasInitializedCategories = useRef(false);
  const currentLanguage: TShopLanguage = useMemo(
    () => (i18n.language?.toUpperCase() || 'KO') as TShopLanguage,
    [i18n]
  );

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
    return [
      ...categoryList.map((category) => ({
        categorySeq: category.categorySeq,
        label:
          category.localeCategoryName?.[currentLanguage] ??
          category.categoryName,
      })),
      { categorySeq: UNCATEGORIZED_CATEGORY_SEQ, label: t('미분류') },
    ];
  }, [categoryListResponse, t, currentLanguage]);

  // 처음 카테고리 로드 시 전체 선택 (한 번만 실행)
  useEffect(() => {
    if (categories.length > 0 && !hasInitializedCategories.current) {
      setSelectedCategories(categories.map((c) => c.categorySeq));
      hasInitializedCategories.current = true;
    }
  }, [categories]);

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

  const filteredItems = useMemo(() => {
    const items = menuSalesHistoryResponse?.data ?? [];

    // 카테고리 필터링 (표시는 로케일, 비교는 categorySeq / 미분류는 이름 없음)
    if (selectedCategories.length === 0) {
      return [];
    }
    const filtered = items.filter((item) => {
      if (!item.categoryName?.trim()) {
        return selectedCategories.includes(UNCATEGORIZED_CATEGORY_SEQ);
      }
      return selectedCategories.includes(item.categorySeq);
    });

    // 정렬 적용
    if (sortBy) {
      const sortedItems = [...filtered];
      switch (sortBy) {
        case 'totalSalesAmount_desc':
          return sortedItems.sort(
            (a, b) => (b.totalSalesAmount ?? 0) - (a.totalSalesAmount ?? 0)
          );
        case 'totalSalesAmount_asc':
          return sortedItems.sort(
            (a, b) => (a.totalSalesAmount ?? 0) - (b.totalSalesAmount ?? 0)
          );
        case 'salesCount_desc':
          return sortedItems.sort(
            (a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0)
          );
        case 'salesCount_asc':
          return sortedItems.sort(
            (a, b) => (a.salesCount ?? 0) - (b.salesCount ?? 0)
          );
        case 'unitPrice_desc':
          return sortedItems.sort(
            (a, b) => (b.unitPrice ?? 0) - (a.unitPrice ?? 0)
          );
        case 'unitPrice_asc':
          return sortedItems.sort(
            (a, b) => (a.unitPrice ?? 0) - (b.unitPrice ?? 0)
          );
        case 'menuName_asc':
          return sortedItems.sort((a, b) =>
            (a.menuName ?? '').localeCompare(b.menuName ?? '', 'ko')
          );
        default:
          return filtered;
      }
    }

    return filtered;
  }, [menuSalesHistoryResponse, selectedCategories, sortBy]);

  const handleSelectStartDate = (date: string) => {
    if (isStartDateAfterEndDate(date, endDate)) {
      toast(t('시작 날짜는 종료 날짜보다 늦을 수 없습니다.'));
      return;
    }
    setStartDate(date);
    setShowStartCalendar(false);
  };

  const handleSelectEndDate = (date: string) => {
    if (isEndDateBeforeStartDate(date, startDate)) {
      toast(t('종료 날짜는 시작 날짜보다 이를 수 없습니다.'));
      return;
    }
    setEndDate(date);
    setShowEndCalendar(false);
  };

  const handleSearch = () => {
    if (!startDate || !endDate) {
      return;
    }

    if (isStartDateAfterEndDate(startDate, endDate)) {
      toast(t('시작 날짜는 종료 날짜보다 늦을 수 없습니다.'));
      return;
    }

    setAppliedRange({ startDate, endDate });
  };

  const toggleCategory = (categorySeq: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySeq)
        ? prev.filter((s) => s !== categorySeq)
        : [...prev, categorySeq]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedCategories(checked ? categories.map((c) => c.categorySeq) : []);
  };

  const allSelected =
    categories.length > 0 && selectedCategories.length === categories.length;

  const sortOptions = useMemo(
    () => [
      { value: 'totalSalesAmount_desc', label: t('매출액 높은 순') },
      { value: 'totalSalesAmount_asc', label: t('매출액 낮은 순') },
      { value: 'salesCount_desc', label: t('판매수 높은 순') },
      { value: 'salesCount_asc', label: t('판매수 낮은 순') },
      { value: 'unitPrice_desc', label: t('단가 높은 순') },
      { value: 'unitPrice_asc', label: t('단가 낮은 순') },
      { value: 'menuName_asc', label: t('메뉴명 가나다 순') },
    ],
    [t]
  );

  return (
    <>
      <UIStyles.setting.TablePageContainer>
        <S.Container>
          <S.Title>
            {t('매출 현황')}
            <div /> <span>{t('메뉴별 매출내역')}</span>
          </S.Title>

          <S.FilterBar>
            <Dropdown
              options={sortOptions}
              value={sortBy}
              onChange={(value) => setSortBy(value as string)}
              placeholder={t('정렬 선택')}
              customStyle={S.Dropdown}
            />
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
              <S.DateButton
                type="button"
                onClick={() => setShowStartCalendar(true)}
              >
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>
                  {formatLocalizedDate(startDate, i18n.language) ||
                    t('날짜 선택')}
                </S.DateText>
              </S.DateButton>

              <S.RangeDivider>~</S.RangeDivider>

              <S.DateButton
                type="button"
                onClick={() => setShowEndCalendar(true)}
              >
                <CalendarMonthIcon
                  width={25}
                  height={25}
                  color={theme.colors.grey[700]}
                />
                <S.DateText>
                  {formatLocalizedDate(endDate, i18n.language) ||
                    t('날짜 선택')}
                </S.DateText>
              </S.DateButton>
            </S.DateRange>

            <BasicButton
              variant="Solid_Navy_M"
              onClick={handleSearch}
              disabled={!startDate || !endDate}
            >
              {t('조회')}
            </BasicButton>
          </S.FilterBar>

          <S.CategoryFilter>
            <S.CategoryHeader>
              <CheckButton
                checked={allSelected}
                onChange={(checked) => handleSelectAll(checked)}
                customStyle={S.SelectAll}
              >
                <p>{t('카테고리 전체선택')}</p>
              </CheckButton>
              <S.CategoryInfoWrapper>
                <AntTooltip
                  title={t(
                    "메뉴의 상위 카테고리가 삭제된 경우, 해당 메뉴는 '미분류'로 분류됩니다"
                  )}
                />
              </S.CategoryInfoWrapper>
            </S.CategoryHeader>
            <S.CategoryChips>
              {categories.map(({ categorySeq, label }) => (
                <S.Chip
                  key={categorySeq}
                  type="button"
                  selected={selectedCategories.includes(categorySeq)}
                  onClick={() => toggleCategory(categorySeq)}
                >
                  {label}
                </S.Chip>
              ))}
            </S.CategoryChips>
          </S.CategoryFilter>

          <S.TableCard>
            <MenuSalesHistoryTable
              key={`${apiStartDate}-${apiEndDate}-${selectedCategories.join(',')}-${sortBy}`}
              rows={filteredItems}
              currentLanguage={currentLanguage}
            />
          </S.TableCard>
        </S.Container>
      </UIStyles.setting.TablePageContainer>

      {showStartCalendar && (
        <Calender
          type="single"
          onClose={() => setShowStartCalendar(false)}
          startDate={startDate}
          endDate={startDate}
          onSelectDate={handleSelectStartDate}
          beforeYears={1}
          afterYears={1}
          i18nInstance={adminI18n}
        />
      )}

      {showEndCalendar && (
        <Calender
          type="single"
          onClose={() => setShowEndCalendar(false)}
          startDate={endDate}
          endDate={endDate}
          onSelectDate={handleSelectEndDate}
          beforeYears={1}
          afterYears={1}
          i18nInstance={adminI18n}
        />
      )}
    </>
  );
};

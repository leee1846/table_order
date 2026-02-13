import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calender,
  BasicButton,
  CheckButton,
  Dropdown,
} from '@repo/ui/components';
import { CalendarMonthIcon, InfoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import { toast } from '@repo/feature/utils';
import adminI18n, { useAdminTranslation } from '@/config/i18n';
import {
  getDateRangeByPreset,
  toYYYYMMDDRange,
  isStartDateAfterEndDate,
  isEndDateBeforeStartDate,
} from '@repo/util/date';
import { useAuth } from '@/hooks/useAuth';
import { useGetCategoryList, useGetMenuSalesHistory } from '@repo/api/queries';
import { MenuSalesHistoryTable } from './Table';
import * as S from './menuSalesHistoryPage.style';

export const MenuSalesHistoryPage = () => {
  const { t } = useAdminTranslation();
  const { shopCode, shopSeq } = useAuth();
  const defaultRange = useMemo(() => getDateRangeByPreset('today'), []);

  const [startDate, setStartDate] = useState<string>(defaultRange.startDate);
  const [endDate, setEndDate] = useState<string>(defaultRange.endDate);
  const [appliedRange, setAppliedRange] = useState(defaultRange);
  const [showStartCalendar, setShowStartCalendar] = useState<boolean>(false);
  const [showEndCalendar, setShowEndCalendar] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [showCategoryTooltip, setShowCategoryTooltip] =
    useState<boolean>(false);
  const hasInitializedCategories = useRef(false);
  const categoryIconWrapperRef = useRef<HTMLDivElement>(null);

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
    const categoryNames = categoryList.map((category) => category.categoryName);
    // 미분류 카테고리를 맨 마지막에 추가
    return [...categoryNames, t('미분류')];
  }, [categoryListResponse, t]);

  // 처음 카테고리 로드 시 전체 선택 (한 번만 실행)
  useEffect(() => {
    if (categories.length > 0 && !hasInitializedCategories.current) {
      setSelectedCategories(categories);
      hasInitializedCategories.current = true;
    }
  }, [categories]);

  // 툴팁 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showCategoryTooltip &&
        categoryIconWrapperRef.current &&
        !categoryIconWrapperRef.current.contains(event.target as Node)
      ) {
        setShowCategoryTooltip(false);
      }
    };

    if (showCategoryTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryTooltip]);

  const handleCategoryIconClick = () => {
    setShowCategoryTooltip(!showCategoryTooltip);
  };

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

    // 카테고리 필터링
    if (selectedCategories.length === 0) {
      return [];
    }
    const filtered = items.filter((item) => {
      const categoryName = item.categoryName || t('미분류');
      return selectedCategories.includes(categoryName);
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
  }, [menuSalesHistoryResponse, selectedCategories, sortBy, t]);

  const handleSelectStartDate = (date: string) => {
    if (isStartDateAfterEndDate(date, endDate)) {
      toast(t('시작 날짜는 종료 날짜보다 이후일 수 없습니다.'));
      return;
    }
    setStartDate(date);
    setShowStartCalendar(false);
  };

  const handleSelectEndDate = (date: string) => {
    if (isEndDateBeforeStartDate(date, startDate)) {
      toast(t('종료 날짜는 시작 날짜보다 이전일 수 없습니다.'));
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
      toast(t('시작 날짜는 종료 날짜보다 이후일 수 없습니다.'));
      return;
    }

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
    if (!date) {
      return t('날짜 선택');
    }
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}${t('년도')} ${month}${t('월_날짜')} ${day}${t('일_날짜')}`;
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
            {t('매출 관리')}
            <div /> <span>{t('메뉴별 매출내역')}</span>
          </S.Title>

          <S.FilterBar>
            <Dropdown
              options={sortOptions}
              value={sortBy}
              onChange={(value) => setSortBy(value as string)}
              placeholder={t('정렬 선택')}
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
                <S.DateText>{formatCalendarText(startDate)}</S.DateText>
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
                <S.DateText>{formatCalendarText(endDate)}</S.DateText>
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
              <S.CategoryInfoWrapper
                ref={categoryIconWrapperRef}
                onClick={handleCategoryIconClick}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleCategoryIconClick();
                }}
              >
                <InfoIcon
                  width={18}
                  height={18}
                  color={theme.colors.grey[500]}
                />
                {showCategoryTooltip && (
                  <S.CategoryTooltip>
                    <S.CategoryTooltipText>
                      {t(
                        "메뉴의 상위 카테고리가 삭제된 경우, 해당 메뉴는 '미분류'로 분류됩니다"
                      )}
                    </S.CategoryTooltipText>
                    <S.CategoryTooltipArrow />
                  </S.CategoryTooltip>
                )}
              </S.CategoryInfoWrapper>
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
              key={`${selectedCategories.join(',')}-${sortBy}`}
              rows={filteredItems}
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

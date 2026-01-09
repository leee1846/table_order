import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination, Input, BasicButton } from '@repo/ui/components';
import { createDebounce } from '@repo/util/function';
import { Table } from './Table';
import * as S from './appHistoryPage.style';
import * as UIStyles from '@repo/ui/styles';
import { MOCK_APP_HISTORY_DATA } from './mockData';
import { ROUTES } from '@/constants/routes';

const PAGE_SIZE = 10;

export const AppHistoryPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const { debouncedFn, cleanup } = createDebounce(
    ((value: string) => {
      setSearchKeyword(value);
    }) as (...args: unknown[]) => void,
    300
  );

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword]);

  // MockData 필터링 (실제로는 API 호출)
  const filteredData = MOCK_APP_HISTORY_DATA.filter((item) => {
    if (!searchKeyword) {
      return true;
    }
    return (
      item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.version.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.type.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  });

  // 페이지네이션 적용
  const paginatedData = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreate = () => {
    navigate(ROUTES.ADMIN_WEB.APP_HISTORY_NEW.generate());
  };

  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Title>
          앱 히스토리
          <div />
          <span>목록</span>
        </S.Title>

        <S.SearchContainer>
          <S.SearchInputWrapper>
            <Input
              placeholder="검색어를 입력하세요"
              value={inputValue}
              onChange={(value) => {
                setInputValue(value);
                debouncedFn(value as unknown);
              }}
            />
          </S.SearchInputWrapper>
          <BasicButton variant="Solid_Navy_M" onClick={handleCreate}>
            앱 히스토리 생성
          </BasicButton>
        </S.SearchContainer>

        <Table histories={paginatedData} />
      </S.Container>

      <UIStyles.setting.Footer>
        <div />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </UIStyles.setting.Footer>
    </UIStyles.setting.TablePageContainer>
  );
};

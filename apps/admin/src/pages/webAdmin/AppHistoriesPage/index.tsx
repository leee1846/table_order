import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination, Input, BasicButton } from '@repo/ui/components';
import { useGetAppVersionList } from '@repo/api/queries';
import { Table } from './Table';
import * as S from './appHistoriesPage.style';
import * as UIStyles from '@repo/ui/styles';
import { ROUTES } from '@/constants/routes';
import { useTablePageState } from '@/feature/AdminWeb/hooks';

const PAGE_SIZE = 10;

export const AppHistoriesPage = () => {
  const navigate = useNavigate();
  const {
    currentPage,
    searchKeyword,
    searchInputValue,
    handleSearchInputChange,
    handlePageChange,
  } = useTablePageState({ pageSize: PAGE_SIZE });

  const { data } = useGetAppVersionList({
    pageNumber: currentPage - 1,
    pageSize: PAGE_SIZE,
    searchWord: searchKeyword,
  });

  const histories = useMemo(() => {
    if (
      !data?.data?.appVersionList ||
      !Array.isArray(data.data.appVersionList)
    ) {
      return [];
    }
    return data.data.appVersionList;
  }, [data]);

  const totalPages = data?.data?.totalPageNumber ?? 1;

  const handleCreate = () => {
    navigate(ROUTES.ADMIN_WEB.APP_HISTORIES_NEW.generate());
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
              value={searchInputValue}
              onChange={handleSearchInputChange}
            />
          </S.SearchInputWrapper>
          <BasicButton variant="Solid_Navy_M" onClick={handleCreate}>
            앱 히스토리 생성
          </BasicButton>
        </S.SearchContainer>

        <Table histories={histories} />
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

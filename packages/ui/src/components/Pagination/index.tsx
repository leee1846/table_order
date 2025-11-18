import { SerializedStyles } from '@emotion/react';
import {
  ChevronBackwardIcon,
  ChevronForwardIcon,
  FirstPageIcon,
  LastPageIcon,
} from '../../icons';
import { theme } from '../../index';
import * as S from './pagination.style';

interface Props {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  customStyle?: SerializedStyles;
}
export const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  customStyle,
}: Props) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    onPageChange(page);
  };

  return (
    <S.Container css={customStyle}>
      <S.Buttons>
        <S.Button onClick={() => handlePageChange(1)} disabled={isFirstPage}>
          <FirstPageIcon
            width={20}
            height={20}
            color={theme.colors.grey[700]}
          />
        </S.Button>
        <S.Button
          padding="0 16px"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isFirstPage}
        >
          <ChevronBackwardIcon
            width={20}
            height={20}
            color={theme.colors.grey[700]}
          />
        </S.Button>
      </S.Buttons>
      <S.Texts>
        <span>{currentPage}</span>
        <span>/</span>
        <span>{totalPages}</span>
      </S.Texts>
      <S.Buttons>
        <S.Button
          padding="0 16px"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLastPage}
        >
          <ChevronForwardIcon
            width={20}
            height={20}
            color={theme.colors.grey[700]}
          />
        </S.Button>
        <S.Button
          onClick={() => handlePageChange(totalPages)}
          disabled={isLastPage}
        >
          <LastPageIcon width={20} height={20} color={theme.colors.grey[700]} />
        </S.Button>
      </S.Buttons>
    </S.Container>
  );
};

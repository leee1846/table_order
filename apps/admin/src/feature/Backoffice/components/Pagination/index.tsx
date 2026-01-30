import type { SerializedStyles } from '@emotion/react';
import {
  ChevronBackwardIcon,
  ChevronForwardIcon,
  FirstPageIcon,
  LastPageIcon,
} from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './pagination.styles';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  customStyle?: SerializedStyles;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  customStyle,
}: Props) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    onPageChange(page);
  };

  return (
    <S.Container css={customStyle}>
      <S.Buttons>
        <S.Button onClick={() => handlePageChange(1)} disabled={isFirstPage}>
          <FirstPageIcon
            width={16}
            height={16}
            color={theme.colors.grey[700]}
          />
        </S.Button>
        <S.Button
          padding="0 12px"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isFirstPage}
        >
          <ChevronBackwardIcon
            width={16}
            height={16}
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
          padding="0 12px"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLastPage}
        >
          <ChevronForwardIcon
            width={16}
            height={16}
            color={theme.colors.grey[700]}
          />
        </S.Button>
        <S.Button
          onClick={() => handlePageChange(totalPages)}
          disabled={isLastPage}
        >
          <LastPageIcon width={16} height={16} color={theme.colors.grey[700]} />
        </S.Button>
      </S.Buttons>
    </S.Container>
  );
};

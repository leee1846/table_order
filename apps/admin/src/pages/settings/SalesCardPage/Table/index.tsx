import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/SalesCardPage/Table/table.style';
import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { formatCurrency } from '@repo/util/string';
import { openDualActionDialog } from '@repo/feature/utils';
import type { ICardApprovalHistoryItem } from '@repo/api/types';

interface Props {
  items: ICardApprovalHistoryItem[];
  isLoading?: boolean;
}

const toNumber = (value?: number | string | null) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const formatTransactionDate = (raw?: string | null) => {
  if (!raw) return '-';
  const digits = raw.replace(/\D/g, '');

  if (digits.length >= 14) {
    const year = digits.slice(0, 4);
    const month = digits.slice(4, 6);
    const day = digits.slice(6, 8);
    const hour = digits.slice(8, 10);
    const minute = digits.slice(10, 12);
    const second = digits.slice(12, 14);

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  return raw;
};

export const Table = ({ items, isLoading }: Props) => {
  const getTextColor = (isCancel: boolean, isApproval?: boolean) => {
    if (isApproval) {
      return isCancel ? theme.colors.semantic[400] : theme.colors.primary[500];
    }

    return isCancel ? theme.colors.semantic[400] : theme.colors.grey[700];
  };

  const onClickCancel = () => {
    openDualActionDialog({
      title: '정말 취소하시겠습니까?',
      primaryText: '확인',
      secondaryText: '취소',
      onConfirm: () => {
        // TODO: 취소 로직 추가
      },
    });
  };

  const renderRows = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={9}>카드 승인 내역을 불러오는 중입니다.</td>
        </tr>
      );
    }

    if (!items || items.length === 0) {
      return (
        <tr>
          <td colSpan={9}>카드 승인 내역이 없습니다.</td>
        </tr>
      );
    }

    return items.map((item, index) => {
      const isCancel = item.approvalType === 'CANCEL';
      const transactionAmount = toNumber(item.transactionAmount);
      const supplyValue = toNumber(item.supplyValue);
      const vat = toNumber(item.vat);
      const transactionDate = formatTransactionDate(item.transactionDate);

      return (
        <tr key={`${index}-${item.approvalNumber}`}>
          <S.ColorTd color={getTextColor(isCancel, true)}>
            {item.approvalType === 'APPROVAL' ? '승인' : '취소'}
          </S.ColorTd>
          <S.ColorTd color={getTextColor(isCancel)}>
            {item.cardNumber ?? '-'}
            <br />[{item.approvalNumber ?? '-'}]
          </S.ColorTd>
          <S.ColorTd color={getTextColor(isCancel)}>
            {formatCurrency(transactionAmount)}
          </S.ColorTd>
          <S.ColorTd color={getTextColor(isCancel)}>
            {formatCurrency(transactionAmount)}
          </S.ColorTd>
          <S.ColorTd color={getTextColor(isCancel)}>
            {transactionDate}
            <br />
            {item.transactionNumber ?? '-'}
          </S.ColorTd>
          <S.ColorTd color={getTextColor(isCancel)}>
            {item.acquirerCompany ?? '-'}
            <br />[{item.issuerCompany ?? '-'}]
          </S.ColorTd>
          <S.ColorTd color={getTextColor(isCancel)}>
            {formatCurrency(supplyValue)}
            <br />
            {formatCurrency(vat)}
          </S.ColorTd>
          <td>-</td>
          <td>
            <BasicButton
              variant="Outline_Navy_M"
              onClick={onClickCancel}
              customStyle={S.cancelButtonCss}
              disabled={isCancel}
            >
              취소
            </BasicButton>
          </td>
        </tr>
      );
    });
  };

  return (
    <UIStyles.setting.Table>
      <UIStyles.setting.Thead>
        <tr>
          <th>
            승인
            <br />
            구분
          </th>
          <th>
            카드번호
            <br />
            (승인번호)
          </th>
          <th>총거래금액</th>
          <th>거래금액</th>
          <th>
            거래승인(취소)일시
            <br />
            거래고유번호
          </th>
          <th>
            매입사
            <br />
            (발급사)
          </th>
          <th>
            공급가
            <br />
            부가세
          </th>
          <th>영수증</th>
          <th>거래취소</th>
        </tr>
      </UIStyles.setting.Thead>
      <UIStyles.setting.Tbody>{renderRows()}</UIStyles.setting.Tbody>
    </UIStyles.setting.Table>
  );
};

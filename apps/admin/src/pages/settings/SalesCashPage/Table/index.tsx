import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import { theme } from '@repo/ui';
import { formatCurrency } from '@repo/util/string';
import * as S from '@/pages/settings/SalesCashPage/Table/table.style';
import { openDualActionDialog } from '@repo/feature/utils';

const LIST = [
  {
    id: 1,
    isCancel: false,
  },
  {
    id: 2,
    isCancel: false,
  },
  {
    id: 3,
    isCancel: false,
  },
  {
    id: 4,
    isCancel: false,
  },
  {
    id: 5,
    isCancel: true,
  },
];

export const Table = () => {
  const getTextColor = (isCancel: boolean, isPayment?: boolean) => {
    if (isPayment) {
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

  return (
    <UIStyles.setting.Table>
      <UIStyles.setting.Thead>
        <tr>
          <th>주문번호</th>
          <th>거래일자</th>
          <th>거래금액</th>
          <th>
            현금영수증
            <br />
            발행여부
          </th>
          <th>
            현금영수증
            <br />
            발행
          </th>
          <th>거래 취소</th>
        </tr>
      </UIStyles.setting.Thead>
      <UIStyles.setting.Tbody>
        {LIST.map((item) => (
          <tr key={item.id}>
            <S.ColorTd color={getTextColor(item.isCancel)}>111533431</S.ColorTd>
            <S.ColorTd color={getTextColor(item.isCancel)}>
              2025-01-01 12:00:00
            </S.ColorTd>
            <S.ColorTd color={getTextColor(item.isCancel)}>
              {formatCurrency(100000)}
            </S.ColorTd>
            <S.ColorTd color={getTextColor(item.isCancel)}>-</S.ColorTd>
            <S.ColorTd color={getTextColor(item.isCancel)}>-</S.ColorTd>
            <td>
              <BasicButton
                variant="Outline_Navy_S"
                onClick={onClickCancel}
                customStyle={S.cancelButtonCss}
              >
                취소
              </BasicButton>
            </td>
          </tr>
        ))}
      </UIStyles.setting.Tbody>
    </UIStyles.setting.Table>
  );
};

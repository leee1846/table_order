import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/SalesCardPage/Table/table.style';
import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { formatCurrency } from '@repo/util';
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
    isCancel: true,
  },
];

export const Table = () => {
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
      <UIStyles.setting.Tbody>
        {LIST.map((item) => (
          <tr key={item.id}>
            <S.ColorTd color={getTextColor(item.isCancel, true)}>
              승인
            </S.ColorTd>
            <S.ColorTd color={getTextColor(item.isCancel)}>
              가상승인
              <br />
              [-]
            </S.ColorTd>
            <S.ColorTd color={getTextColor(item.isCancel)}>
              {formatCurrency(100000)}
            </S.ColorTd>
            <S.ColorTd color={getTextColor(item.isCancel)}>
              {formatCurrency(100000)}
            </S.ColorTd>
            <S.ColorTd color={getTextColor(item.isCancel)}>
              2025-01-01 12:00:00
              <br />
              2321313
            </S.ColorTd>
            <S.ColorTd color={getTextColor(item.isCancel)}>
              기타카드
              <br />
              [임의결제]
            </S.ColorTd>
            <S.ColorTd color={getTextColor(item.isCancel)}>
              {formatCurrency(100000)}
              <br />
              {formatCurrency(10000)}
            </S.ColorTd>
            <td>-</td>
            <td>
              <BasicButton
                variant="Outline_Navy_M"
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

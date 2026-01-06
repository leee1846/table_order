import { t } from '@/config/i18n';
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
      title: t(
        '정말 취소하시겠습니까?'
      ),
      primaryText: t('확인'),
      secondaryText: t('취소'),
      onConfirm: () => {
        // TODO: 취소 로직 추가
      },
    });
  };

  return (
    <UIStyles.setting.Table>
      <UIStyles.setting.Thead>
        <tr>
          <th>{t('주문번호')}</th>
          <th>{t('거래일자')}</th>
          <th>{t('거래금액')}</th>
          <th>
            {t('현금영수증')}

            <br />
            {t('발행여부')}
          </th>
          <th>
            {t('현금영수증')}

            <br />
            {t('발행')}
          </th>
          <th>{t('거래 취소')}</th>
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
                {t('취소')}
              </BasicButton>
            </td>
          </tr>
        ))}
      </UIStyles.setting.Tbody>
    </UIStyles.setting.Table>
  );
};

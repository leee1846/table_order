import { BasicButton, ModalBackground } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/MenuSelector/OptionDetailModal/optionDetailModal.style';
import { CloseIcon } from '@repo/ui/icons';
import { useThemeMode } from '@repo/ui';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import type { ICartMenu } from '@/types/cart';
import { formatCurrency } from '@repo/util/string';
import { calculateMenuTotalPrice } from '@/utils/calculation';

interface Props {
  menu?: ICartMenu;
  onClose: () => void;
}
export const OptionDetailModal = ({ menu, onClose }: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();

  if (!menu) {
    return null;
  }

  const totalPrice = calculateMenuTotalPrice(
    menu.menuPrice,
    menu.quantity,
    menu.selectedOptions.map((option) => ({
      optionPrice: option.optionPrice,
      quantity: option.quantity,
    }))
  );

  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
        </S.CloseButton>

        <h1>{t('추가한 옵션')}</h1>

        <S.OptionsContainer>
          <S.MenuInfo>
            <p>{menu.menuName}</p>
            <p>{formatCurrency(menu.quantity)}</p>
            <p>{formatCurrency(menu.menuPrice)}</p>
          </S.MenuInfo>

          <S.OptionList>
            {menu.selectedOptions.map((option, index) => (
              <li key={`${option.optionSeq}-${index + 1}`}>
                <div>
                  <span />
                  <p>{option.optionName}</p>
                </div>

                <div>
                  <p>{formatCurrency(option.quantity)}</p>
                  <p>{formatCurrency(option.optionPrice * option.quantity)}</p>
                </div>
              </li>
            ))}
          </S.OptionList>
        </S.OptionsContainer>

        <S.TotalContainer>
          <S.TotalInfo>
            <p>{t('합계')}</p>
            <p>{t('{{amount}}원', { amount: formatCurrency(totalPrice) })}</p>
          </S.TotalInfo>
          <BasicButton variant="Solid_Blue_2XL" onClick={onClose}>
            {t('확인')}
          </BasicButton>
        </S.TotalContainer>
      </S.Container>
    </ModalBackground>
  );
};

import { Input } from '@repo/ui/components';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/AdditionalSetting/additionalSetting.style';
import type { ICreateMenuRequest } from '@repo/api/types';

// const TOUCH_KEY_COLORS = [
//   '#FF909D',
//   '#FFF47C',
//   '#7CFFB1',
//   '#FFCFF1',
//   '#7CC6FF',
// ];

interface AdditionalSettingProps {
  values?: Partial<ICreateMenuRequest>;
  onChange?: (nextValue: Partial<ICreateMenuRequest>) => void;
}

export const AdditionalSetting = ({
  values,
  onChange,
}: AdditionalSettingProps) => {
  const handleChangeMinQuantity = (value: string) => {
    const numericString = value.replace(/[^0-9]/g, '');
    onChange?.({
      minQuantity: numericString.length > 0 ? Number(numericString) : undefined,
    });
  };

  return (
    <S.Container>
      <S.SetionContainer>
        <p>포스연동 메뉴코드</p>
        <Input disabled value={values?.mappedMenuCode ?? ''} />
      </S.SetionContainer>
      <S.SetionContainer>
        <p>최소 주문 수량</p>
        <Input
          value={
            values?.minQuantity !== undefined
              ? values.minQuantity.toString()
              : ''
          }
          onChange={(value) => handleChangeMinQuantity(value)}
        />
      </S.SetionContainer>
      {/* <S.SetionContainer>
        <p>터치키 색상</p>
        <S.ColorChips>
          {TOUCH_KEY_COLORS.map((color) => (
            <S.ColorChip
              key={color}
              type="button"
              color={color}
              selected={values?.touchKeyColorCode === color}
              onClick={() => onChange?.({ touchKeyColorCode: color })}
              aria-pressed={values?.touchKeyColorCode === color}
            />
          ))}
        </S.ColorChips>
      </S.SetionContainer> */}
    </S.Container>
  );
};

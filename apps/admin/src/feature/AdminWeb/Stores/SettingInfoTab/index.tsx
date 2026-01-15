import { Input } from '@repo/ui/components';
import * as S from '../StoreInfoTab/storeInfoTab.style';
import type { IGetAdminShopDetail } from '@repo/api/types';

type Mode = 'create' | 'edit';

interface Props {
  mode: Mode;
  formData: IGetAdminShopDetail;
  updateFormData: (updates: Partial<IGetAdminShopDetail>) => void;
}

export const SettingInfoTab = ({ mode, formData, updateFormData }: Props) => {
  return (
    <S.Container>
      <S.Section>
        <S.FieldGroup>
          <S.Label>개발해야함</S.Label>
          <Input
            placeholder="세팅 정보를 입력하세요"
            value=""
            onChange={() => {
              // TODO: 세팅 정보 입력 필드 구현
            }}
          />
        </S.FieldGroup>
      </S.Section>
    </S.Container>
  );
};

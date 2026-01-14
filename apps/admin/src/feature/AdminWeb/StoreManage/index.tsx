import { useState, useEffect } from 'react';
import { BasicButton } from '@repo/ui/components';
import { StoreInfoTab } from '@/feature/AdminWeb/StoreManage/StoreInfoTab';
import { MemberInfoTab } from '@/feature/AdminWeb/StoreManage/MemberInfoTab';
import { SettingInfoTab } from '@/feature/AdminWeb/StoreManage/SettingInfoTab';
import * as S from './storeManage.style';
import type {
  ICreateAdminMemberRequest,
  IGetAdminShopDetail,
} from '@repo/api/types';
import { DEFAULT_MEMBER_DATA, DEFAULT_SHOP_DATA } from './constants';

type TabType = 'storeInfo' | 'memberInfo' | 'settingInfo';
type Mode = 'create' | 'edit';

interface Props {
  mode: Mode;
  initialData?: IGetAdminShopDetail;
  memberInitialData?: ICreateAdminMemberRequest;
  onSave: (
    shopData: IGetAdminShopDetail,
    memberData: ICreateAdminMemberRequest
  ) => Promise<void>;
}

export const StoreManage = ({
  mode,
  initialData,
  memberInitialData,
  onSave,
}: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>('storeInfo');
  const [formData, setFormData] =
    useState<IGetAdminShopDetail>(DEFAULT_SHOP_DATA);
  const [memberFormData, setMemberFormData] =
    useState<ICreateAdminMemberRequest>(DEFAULT_MEMBER_DATA);

  useEffect(() => {
    if (memberInitialData) {
      setMemberFormData((prev) => {
        return {
          ...prev,
          ...memberInitialData,
        };
      });
      return;
    }
  }, [memberInitialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setMemberFormData((prev) => ({
        ...prev,
        shopSeq: initialData?.shopSeq ?? 0,
      }));
    }
  }, [initialData]);

  const updateFormData = (updates: Partial<IGetAdminShopDetail>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    await onSave(formData, memberFormData);
  };

  const title = mode === 'create' ? '매장 생성' : '매장 수정';

  return (
    <S.Container>
      <S.Header>
        <S.Titles>
          <p>매장관리</p>
          <span />
          <div>
            <p>{title}</p>
          </div>
        </S.Titles>
        <BasicButton variant="Solid_Navy_M" onClick={handleSave}>
          저장
        </BasicButton>
      </S.Header>

      <S.TabContainer>
        <S.TabButton
          type="button"
          isActive={activeTab === 'storeInfo'}
          onClick={() => setActiveTab('storeInfo')}
        >
          매장 정보
        </S.TabButton>
        {mode === 'edit' && (
          <S.TabButton
            type="button"
            isActive={activeTab === 'memberInfo'}
            onClick={() => setActiveTab('memberInfo')}
          >
            계정 정보
          </S.TabButton>
        )}
        <S.TabButton
          type="button"
          isActive={activeTab === 'settingInfo'}
          onClick={() => setActiveTab('settingInfo')}
        >
          세팅 정보
        </S.TabButton>
      </S.TabContainer>

      <S.TabContent>
        {activeTab === 'storeInfo' && (
          <StoreInfoTab
            mode={mode}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}

        {activeTab === 'memberInfo' && mode === 'edit' && (
          <MemberInfoTab
            formData={memberFormData}
            updateFormData={(updates) =>
              setMemberFormData((prev) => ({ ...prev, ...updates }))
            }
          />
        )}

        {activeTab === 'settingInfo' && (
          <SettingInfoTab
            mode={mode}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
      </S.TabContent>
    </S.Container>
  );
};

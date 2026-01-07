import { useState } from 'react';
import { BasicButton } from '@repo/ui/components';
import type { StoreFormData } from '@/feature/AdminWeb/StoreManage/types';
import { StoreInfoTab } from '@/feature/AdminWeb/StoreManage/StoreInfoTab';
import * as S from './storeManage.style';

type TabType = 'storeInfo' | 'settingInfo';
type Mode = 'create' | 'edit';

interface Props {
  mode: Mode;
  initialData?: Partial<StoreFormData>;
  onSave: (data: StoreFormData) => Promise<void>;
}

const getDefaultFormData = (): StoreFormData => ({
  storeName: '',
  searchStoreName: '',
  businessNumber: '',
  isCorporation: false,
  address: '',
  detailAddress: '',
  storeEmail: '',
  representativeName: '',
  representativeContact: '',
  managerName: '',
  managerContact: '',
  businessType: null,
  businessCategory: null,
  isActive: true,
  isTestStore: false,
  isOfficialUpdate: false,
  isBetaUpdate: false,
  version: '1.0.0',
});

export const StoreManage = ({ mode, initialData, onSave }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>('storeInfo');
  const [formData, setFormData] = useState<StoreFormData>(() => {
    const defaultData = getDefaultFormData();
    return initialData ? { ...defaultData, ...initialData } : defaultData;
  });
  const [isSaving, setIsSaving] = useState(false);

  const updateFormData = (updates: Partial<StoreFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      // TODO: 에러 처리
      // eslint-disable-next-line no-console
      console.error('Failed to save store:', error);
    } finally {
      setIsSaving(false);
    }
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
        <BasicButton
          variant="Solid_Navy_M"
          onClick={handleSave}
          disabled={isSaving}
        >
          저장
        </BasicButton>
      </S.Header>

      <S.TabContainer>
        <S.TabButton
          type="button"
          isActive={activeTab === 'storeInfo'}
          onClick={() => setActiveTab('storeInfo')}
        >
          매장정보
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
      </S.TabContent>
    </S.Container>
  );
};

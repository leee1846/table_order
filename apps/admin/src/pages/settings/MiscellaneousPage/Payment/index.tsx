import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { Dropdown, ToggleButton } from '@repo/ui/components';

export const Payment = () => {
  return (
    <SectionWrapper title="결제 및 매출 설정">
      <UIStyles.setting.ContentLayout>
        <p>매장 결제 방식</p>
        <Dropdown options={[]} value={''} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>선불 VAN</p>
        <Dropdown options={[]} value={''} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>선불 VAN ID</p>
        <input type="text" />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>선결제 더치페이 사용</p>
        <ToggleButton size="M" isOn={false} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>선불형 후불결제 사용</p>
        <ToggleButton size="M" isOn={false} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>선불형 자동초기화 사용</p>
        <ToggleButton size="M" isOn={false} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>현금결제 유도 팝업 사용</p>
        <ToggleButton size="M" isOn={false} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>선불형 현금결제 사용</p>
        <ToggleButton size="M" isOn={false} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>카드 단말기</p>
        <Dropdown options={[]} value={''} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>통화설정</p>
        <Dropdown options={[]} value={''} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>봉사료율</p>
        <input type="text" />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>매출 총 금액 노출 여부</p>
        <ToggleButton size="M" isOn={false} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>매출 비밀번호</p>
        <input type="text" />
      </UIStyles.setting.ContentLayout>
    </SectionWrapper>
  );
};

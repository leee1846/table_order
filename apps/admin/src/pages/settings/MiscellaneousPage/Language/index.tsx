import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as UIStyles from '@repo/ui/styles';
import { CheckButton, Dropdown, ToggleButton } from '@repo/ui/components';
import { useState } from 'react';
import * as S from '@/pages/settings/MiscellaneousPage/Language/language.style';

export const Language = () => {
  const [isMultilingual, setIsMultilingual] = useState(false);

  return (
    <SectionWrapper title="언어">
      <UIStyles.setting.ContentLayout>
        <p>메인 언어</p>
        <Dropdown options={[]} value={''} onChange={() => {}} />
      </UIStyles.setting.ContentLayout>
      <div>
        <UIStyles.setting.ContentLayout>
          <p>다국어 사용</p>
          <ToggleButton
            size="M"
            isOn={isMultilingual}
            onChange={() => setIsMultilingual(!isMultilingual)}
          />
        </UIStyles.setting.ContentLayout>
        {isMultilingual && (
          <S.CheckboxWrapper>
            <div>
              <CheckButton
                checked={true}
                onChange={() => {}}
                customStyle={S.checkboxCss}
              >
                <S.CheckboxText>한국어</S.CheckboxText>
              </CheckButton>
              <CheckButton
                checked={false}
                onChange={() => {}}
                customStyle={S.checkboxCss}
              >
                <S.CheckboxText>영어</S.CheckboxText>
              </CheckButton>
              <CheckButton
                checked={false}
                onChange={() => {}}
                customStyle={S.checkboxCss}
              >
                <S.CheckboxText>중국어</S.CheckboxText>
              </CheckButton>
              <CheckButton
                checked={false}
                onChange={() => {}}
                customStyle={S.checkboxCss}
              >
                <S.CheckboxText>일본어</S.CheckboxText>
              </CheckButton>
            </div>
            <CheckButton
              checked={false}
              onChange={() => {}}
              customStyle={S.checkboxCss}
            >
              <S.CheckboxText>주문 전 언어 선택</S.CheckboxText>
            </CheckButton>
          </S.CheckboxWrapper>
        )}
      </div>
    </SectionWrapper>
  );
};

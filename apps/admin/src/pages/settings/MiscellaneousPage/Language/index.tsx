import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import * as CommonStyles from '@/pages/settings/MiscellaneousPage/common/common.style';
import { CheckButton, Dropdown, ToggleButton } from '@repo/ui/components';
import { useId, useState } from 'react';
import * as S from '@/pages/settings/MiscellaneousPage/Language/language.style';

export const Language = () => {
  const [isMultilingual, setIsMultilingual] = useState(false);
  const koLanguageId = useId();
  const enLanguageId = useId();
  const zhLanguageId = useId();
  const jaLanguageId = useId();
  const beforeOrderLanguageId = useId();

  return (
    <SectionWrapper title="언어">
      <CommonStyles.ContentLayout>
        <p>메인 언어</p>
        <Dropdown options={[]} value={''} onChange={() => {}} />
      </CommonStyles.ContentLayout>
      <div>
        <CommonStyles.ContentLayout>
          <p>다국어 사용</p>
          <ToggleButton
            size="M"
            isOn={isMultilingual}
            onChange={() => setIsMultilingual(!isMultilingual)}
          />
        </CommonStyles.ContentLayout>
        {isMultilingual && (
          <S.CheckboxWrapper>
            <div>
              <CheckButton
                id={`ko-${koLanguageId}`}
                checked={true}
                onChange={() => {}}
                customStyle={S.checkboxCss}
              >
                <S.CheckboxText>한국어</S.CheckboxText>
              </CheckButton>
              <CheckButton
                id={`en-${enLanguageId}`}
                checked={false}
                onChange={() => {}}
                customStyle={S.checkboxCss}
              >
                <S.CheckboxText>영어</S.CheckboxText>
              </CheckButton>
              <CheckButton
                id={`zh-${zhLanguageId}`}
                checked={false}
                onChange={() => {}}
                customStyle={S.checkboxCss}
              >
                <S.CheckboxText>중국어</S.CheckboxText>
              </CheckButton>
              <CheckButton
                id={`ja-${jaLanguageId}`}
                checked={false}
                onChange={() => {}}
                customStyle={S.checkboxCss}
              >
                <S.CheckboxText>일본어</S.CheckboxText>
              </CheckButton>
            </div>
            <CheckButton
              id={`before-order-language-${beforeOrderLanguageId}`}
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

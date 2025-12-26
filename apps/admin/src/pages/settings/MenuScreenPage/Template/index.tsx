import { useState } from 'react';
import { Dropdown, ToggleButton } from '@repo/ui/components';
import * as S from '@/pages/settings/MenuScreenPage/Template/template.style';

const templateOptions = [
  { value: 'horizontal-basic', label: '가로 기본형' },
  { value: 'horizontal-image', label: '가로 이미지형' },
  { value: 'vertical-basic', label: '세로 기본형' },
  { value: 'vertical-image', label: '세로 이미지형' },
];

export const Template = () => {
  const [isThreeColumnLayout, setIsThreeColumnLayout] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('horizontal-basic');

  const handleToggleThreeColumn = () => {
    setIsThreeColumnLayout(!isThreeColumnLayout);
  };

  return (
    <S.Container>
      <p>템플릿 설정</p>
      <S.TemplateOptions>
        <S.OptionRow>
          <S.OptionLabel>3열 배치</S.OptionLabel>
          <ToggleButton
            size="M"
            isOn={isThreeColumnLayout}
            onChange={handleToggleThreeColumn}
          />
        </S.OptionRow>
        <S.OptionRow>
          <S.OptionLabel>템플릿 선택</S.OptionLabel>
          <Dropdown
            options={templateOptions}
            value={selectedTemplate}
            onChange={(value) => setSelectedTemplate(value as string)}
          />
        </S.OptionRow>
      </S.TemplateOptions>
    </S.Container>
  );
};


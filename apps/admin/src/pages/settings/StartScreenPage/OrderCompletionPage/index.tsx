import { useState } from 'react';
import { RadioButton } from '@repo/ui/components';
import { PhotoIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './orderCompletionPage.style';

export const OrderCompletionPage = () => {
  const [selectedType, setSelectedType] = useState<'basic' | 'orderForm'>(
    'basic'
  );
  const [message, setMessage] = useState('');

  return (
    <S.Container>
      <S.Header>
        <p>주문 완료 페이지</p>
      </S.Header>
      <S.TypeSection>
        <S.RadioGroup>
          <S.RadioItem>
            <RadioButton
              value="basic"
              onChange={() => setSelectedType('basic')}
              checked={selectedType === 'basic'}
              customStyle={S.RadioButtonStyle}
            >
              <span>기본</span>
            </RadioButton>
          </S.RadioItem>
          <S.RadioItem>
            <RadioButton
              value="orderForm"
              onChange={() => setSelectedType('orderForm')}
              checked={selectedType === 'orderForm'}
              customStyle={S.RadioButtonStyle}
            >
              <span>주문서</span>
            </RadioButton>
          </S.RadioItem>
        </S.RadioGroup>
      </S.TypeSection>
      <S.ContentContainer>
        <S.ImageSection>
          <PhotoIcon width={36} height={36} color={theme.colors.grey[400]} />
          <p>메뉴판 사용 종료후 노출될 사진을 설정할 수 있어요.</p>
          <S.SizeInfo>
            <span>(권장사이즈 930 * 800px)</span>
          </S.SizeInfo>
        </S.ImageSection>
        <S.MessageSection>
          <S.TextArea
            placeholder="주문 후 마지막 화면에 표시될 문구를 적어주세요."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </S.MessageSection>
      </S.ContentContainer>
    </S.Container>
  );
};

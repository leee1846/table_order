import { useRef, useEffect } from 'react';
import { Input, Dropdown } from '@repo/ui/components';
import * as S from './noticesForm.style';
import { BOARD_TYPE_OPTIONS, type NoticesFormData } from '../constants';

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  formData: NoticesFormData;
  updateFormData: (updates: Partial<NoticesFormData>) => void;
}

export const NoticesForm = ({ mode, formData, updateFormData }: Props) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isReadOnly = mode === 'detail';

  // detail 모드일 때 textarea 높이를 내용에 맞게 자동 조절
  useEffect(() => {
    if (isReadOnly && textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [formData.content, isReadOnly]);

  return (
    <S.Container>
      <S.Section>
        <S.FieldGroup>
          <S.Label>
            유형 <span>*</span>
          </S.Label>
          <Dropdown
            options={BOARD_TYPE_OPTIONS}
            value={formData.boardType}
            onChange={(value) => updateFormData({ boardType: value as string })}
            disabled={isReadOnly}
            placeholder="유형 선택"
          />
        </S.FieldGroup>
      </S.Section>

      <S.Section>
        <S.FieldGroup>
          <S.Label>
            제목 <span>*</span>
          </S.Label>
          <Input
            placeholder="제목을 입력하세요"
            value={formData.title}
            onChange={(value) => updateFormData({ title: value })}
            disabled={isReadOnly}
          />
        </S.FieldGroup>
      </S.Section>

      <S.Section>
        <S.FieldGroup>
          <S.Label>
            내용 <span>*</span>
          </S.Label>
          <S.TextArea
            ref={textAreaRef}
            placeholder="내용을 입력하세요"
            value={formData.content}
            onChange={(e) => updateFormData({ content: e.target.value })}
            disabled={isReadOnly}
            isDetail={isReadOnly}
          />
        </S.FieldGroup>
      </S.Section>

      {(mode === 'edit' || mode === 'detail') && (
        <S.Section>
          <S.HorizontalLayout>
            <S.FieldGroup>
              <S.Label>생성일자</S.Label>
              <Input
                placeholder="생성일자"
                value={formData.createdAt || ''}
                onChange={() => {
                  // readOnly
                }}
                disabled
              />
            </S.FieldGroup>
            <S.FieldGroup>
              <S.Label>수정일자</S.Label>
              <Input
                placeholder="수정일자"
                value={formData.updatedAt || ''}
                onChange={() => {
                  // readOnly
                }}
                disabled
              />
            </S.FieldGroup>
          </S.HorizontalLayout>
        </S.Section>
      )}
    </S.Container>
  );
};

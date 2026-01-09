import { useState, useRef, useEffect } from 'react';
import { Input, Dropdown, Calender } from '@repo/ui/components';
import { CalendarMonthIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './appHistoryForm.style';
import type { AppHistoryFormData } from '../constants';

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  formData: AppHistoryFormData;
  updateFormData: (updates: Partial<AppHistoryFormData>) => void;
}

const TYPE_OPTIONS = [
  { value: 'MENU', label: '메뉴판' },
  { value: 'POS', label: '포스앱' },
  { value: 'AGENT', label: '에이전트' },
];

export const AppHistoryForm = ({
  mode,
  formData,
  updateFormData,
}: Props) => {
  const [showCalender, setShowCalender] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // deployDateTime에서 날짜 부분만 추출 (YYYY-MM-DD 형식)
  const getDateOnly = (dateTime: string) => {
    if (!dateTime) {
      return '';
    }
    // "YYYY-MM-DD HH:mm:ss" 형식에서 날짜 부분만 추출
    return dateTime.split(' ')[0];
  };

  const handleDateSelect = (startDate: string, _endDate: string) => {
    // 단일 날짜 선택이므로 startDate만 사용
    // 시간은 기본값으로 00:00:00을 추가
    const dateTime = `${startDate} 00:00:00`;
    updateFormData({ deployDateTime: dateTime });
    setShowCalender(false);
  };

  const displayDate = getDateOnly(formData.deployDateTime);
  const calendarStartDate = displayDate || '';
  const isReadOnly = mode === 'detail';

  // detail 모드일 때 textarea 높이를 내용에 맞게 자동 조절
  useEffect(() => {
    if (isReadOnly && textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [formData.content, isReadOnly]);

  return (
    <>
      <S.Container>
        <S.Section>
          <S.FieldGroup>
            <S.Label>
              구분 <span>*</span>
            </S.Label>
            <Dropdown
              options={TYPE_OPTIONS}
              value={formData.type}
              onChange={(value) => updateFormData({ type: value as string })}
              disabled={isReadOnly}
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
              배포일시 <span>*</span>
            </S.Label>
            {isReadOnly ? (
              <Input
                placeholder="배포일시"
                value={formData.deployDateTime}
                onChange={() => {
                  // readOnly
                }}
                disabled
              />
            ) : (
              <S.CalendarButton
                type="button"
                onClick={() => setShowCalender(true)}
              >
                <CalendarMonthIcon
                  width={32}
                  height={32}
                  color={theme.colors.grey[700]}
                />
                <S.CalendarText>
                  {displayDate || '날짜 선택'}
                </S.CalendarText>
              </S.CalendarButton>
            )}
          </S.FieldGroup>
        </S.Section>

        <S.Section>
          <S.FieldGroup>
            <S.Label>
              버전 <span>*</span>
            </S.Label>
            <Input
              placeholder="버전을 입력하세요 (예: 1.2.3)"
              value={formData.version}
              onChange={(value) => updateFormData({ version: value })}
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
          <>
            <S.Section>
              <S.HorizontalLayout>
                <S.FieldGroup>
                  <S.Label>최초 등록일시</S.Label>
                  <Input
                    placeholder="최초 등록일시"
                    value={formData.createdAt || ''}
                    onChange={() => {
                      // readOnly
                    }}
                    disabled
                  />
                </S.FieldGroup>
                <S.FieldGroup>
                  <S.Label>마지막 수정일시</S.Label>
                  <Input
                    placeholder="마지막 수정일시"
                    value={formData.updatedAt || ''}
                    onChange={() => {
                      // readOnly
                    }}
                    disabled
                  />
                </S.FieldGroup>
              </S.HorizontalLayout>
            </S.Section>
          </>
        )}
      </S.Container>

      {showCalender && !isReadOnly && (
        <Calender
          type="single"
          onClose={() => setShowCalender(false)}
          startDate={calendarStartDate}
          endDate={calendarStartDate}
          onSelectDate={handleDateSelect}
          beforeYears={1}
          afterYears={1}
        />
      )}
    </>
  );
};


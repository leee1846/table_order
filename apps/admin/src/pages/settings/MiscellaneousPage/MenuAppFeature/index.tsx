import { SectionWrapper } from '@/pages/settings/MiscellaneousPage/common/SectionWrapper';
import { BasicButton, ToggleButton } from '@repo/ui/components';
import { useRef, useState } from 'react';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/MenuAppFeature/menuAppFeature.style';
import { useTimeInput } from '@/hooks/useTimeInput';

export const MenuAppFeature = () => {
  const [isTestOn, setIsTestOn] = useState(false);

  const breakTimeEndHourRef = useRef<HTMLInputElement>(null);
  const breakTimeStartTime = useTimeInput({ nextRef: breakTimeEndHourRef });
  const breakTimeEndTime = useTimeInput();

  const breakTimeLastOrderHourRef = useRef<HTMLInputElement>(null);
  const breakTimeLastOrderTime = useTimeInput({
    nextRef: breakTimeLastOrderHourRef,
  });

  const [breakTimeLastOrderMinutes, setBreakTimeLastOrderMinutes] = useState<
    string | null
  >(null);

  return (
    <SectionWrapper title="메뉴판 기능 설정">
      <UIStyles.setting.ContentLayout>
        <p>주문하기 사용</p>
        <ToggleButton
          size="M"
          isOn={isTestOn}
          onChange={() => setIsTestOn(!isTestOn)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>첫주문 필수 카테고리 설정</p>
        <BasicButton variant="Outline_Navy_M" onClick={() => {}}>
          카테고리 설정
        </BasicButton>
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>첫주문 금액</p>
        <input type="text" />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>객수사용</p>
        <ToggleButton
          size="M"
          isOn={isTestOn}
          onChange={() => setIsTestOn(!isTestOn)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>주문서 합계금액 노출 여부</p>
        <ToggleButton
          size="M"
          isOn={isTestOn}
          onChange={() => setIsTestOn(!isTestOn)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>주문완료 페이지 총금액 노출 여부</p>
        <ToggleButton
          size="M"
          isOn={isTestOn}
          onChange={() => setIsTestOn(!isTestOn)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>단일페이지 메뉴 사용</p>
        <ToggleButton
          size="M"
          isOn={isTestOn}
          onChange={() => setIsTestOn(!isTestOn)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>메뉴판 관리 비밀번호</p>
        <input type="text" />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>관리잠금</p>
        <ToggleButton
          size="M"
          isOn={isTestOn}
          onChange={() => setIsTestOn(!isTestOn)}
        />
      </UIStyles.setting.ContentLayout>
      <UIStyles.setting.ContentLayout>
        <p>도난방지 알림팝업</p>
        <ToggleButton
          size="M"
          isOn={isTestOn}
          onChange={() => setIsTestOn(!isTestOn)}
        />
      </UIStyles.setting.ContentLayout>
      <div>
        <UIStyles.setting.ContentLayout>
          <p>픽업 메세지 사용</p>
          <ToggleButton
            size="M"
            isOn={isTestOn}
            onChange={() => setIsTestOn(!isTestOn)}
          />
        </UIStyles.setting.ContentLayout>
        {isTestOn && (
          <S.TextAreaContainer>
            <textarea />
          </S.TextAreaContainer>
        )}
      </div>
      <div>
        <UIStyles.setting.ContentLayout>
          <p>브레이크타임 사용</p>
          <ToggleButton
            size="M"
            isOn={isTestOn}
            onChange={() => setIsTestOn(!isTestOn)}
          />
        </UIStyles.setting.ContentLayout>
        {isTestOn && (
          <S.InnerSection>
            <S.InnerSectionItem>
              <p>브레이크타임 </p>
              <UIStyles.setting.TimeRangeInput>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={breakTimeStartTime.hour}
                  onChange={breakTimeStartTime.handleHourChange}
                  maxLength={2}
                />
                <span>:</span>
                <input
                  ref={breakTimeStartTime.minuteRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={breakTimeStartTime.minute}
                  onChange={breakTimeStartTime.handleMinuteChange}
                  onKeyDown={breakTimeStartTime.handleMinuteKeyDown}
                  maxLength={2}
                />
                <span>-</span>
                <input
                  ref={breakTimeEndHourRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={breakTimeEndTime.hour}
                  onChange={breakTimeEndTime.handleHourChange}
                  maxLength={2}
                />
                <span>:</span>
                <input
                  ref={breakTimeEndTime.minuteRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={breakTimeEndTime.minute}
                  onChange={breakTimeEndTime.handleMinuteChange}
                  onKeyDown={breakTimeEndTime.handleMinuteKeyDown}
                  maxLength={2}
                />
              </UIStyles.setting.TimeRangeInput>
            </S.InnerSectionItem>
            <S.InnerSectionItem>
              <p>브레이크타임 라스트오더 시간</p>
              <UIStyles.setting.SingleTimeInput>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={breakTimeLastOrderTime.hour}
                  onChange={breakTimeLastOrderTime.handleHourChange}
                  maxLength={2}
                />
                <span>:</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={breakTimeLastOrderTime.minute}
                  onChange={breakTimeLastOrderTime.handleMinuteChange}
                  onKeyDown={breakTimeLastOrderTime.handleMinuteKeyDown}
                  maxLength={2}
                />
              </UIStyles.setting.SingleTimeInput>
            </S.InnerSectionItem>
            <S.InnerSectionItem>
              <p>라스트 오더 알림</p>
              <UIStyles.setting.SingleTimeInput>
                <input
                  type="number"
                  value={breakTimeLastOrderMinutes ?? ''}
                  onChange={(e) =>
                    setBreakTimeLastOrderMinutes(e.target.value ?? null)
                  }
                />
                <span>분전</span>
              </UIStyles.setting.SingleTimeInput>
            </S.InnerSectionItem>
            <S.TextAreasContainer>
              <div>
                <p>주문 마감 사전 안내 메세지</p>
                <textarea />
              </div>
              <div>
                <p>브레이크타임 안내 메세지</p>
                <textarea />
              </div>
            </S.TextAreasContainer>
          </S.InnerSection>
        )}
      </div>

      <div>
        <UIStyles.setting.ContentLayout>
          <p>영업마감안내 사용</p>
          <ToggleButton
            size="M"
            isOn={isTestOn}
            onChange={() => setIsTestOn(!isTestOn)}
          />
        </UIStyles.setting.ContentLayout>
        {isTestOn && (
          <S.InnerSection>
            <S.InnerSectionItem>
              <p>영업마감시간</p>
              <UIStyles.setting.TimeRangeInput>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={breakTimeStartTime.hour}
                  onChange={breakTimeStartTime.handleHourChange}
                  maxLength={2}
                />
                <span>:</span>
                <input
                  ref={breakTimeStartTime.minuteRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={breakTimeStartTime.minute}
                  onChange={breakTimeStartTime.handleMinuteChange}
                  onKeyDown={breakTimeStartTime.handleMinuteKeyDown}
                  maxLength={2}
                />
                <span>-</span>
                <input
                  ref={breakTimeEndHourRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={breakTimeEndTime.hour}
                  onChange={breakTimeEndTime.handleHourChange}
                  maxLength={2}
                />
                <span>:</span>
                <input
                  ref={breakTimeEndTime.minuteRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={breakTimeEndTime.minute}
                  onChange={breakTimeEndTime.handleMinuteChange}
                  onKeyDown={breakTimeEndTime.handleMinuteKeyDown}
                  maxLength={2}
                />
              </UIStyles.setting.TimeRangeInput>
            </S.InnerSectionItem>
            <S.InnerSectionItem>
              <p>영업마감시간 라스트오더 시간</p>
              <UIStyles.setting.SingleTimeInput>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={breakTimeLastOrderTime.hour}
                  onChange={breakTimeLastOrderTime.handleHourChange}
                  maxLength={2}
                />
                <span>:</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="00"
                  value={breakTimeLastOrderTime.minute}
                  onChange={breakTimeLastOrderTime.handleMinuteChange}
                  onKeyDown={breakTimeLastOrderTime.handleMinuteKeyDown}
                  maxLength={2}
                />
              </UIStyles.setting.SingleTimeInput>
            </S.InnerSectionItem>
            <S.InnerSectionItem>
              <p>라스트 오더 알림</p>
              <UIStyles.setting.SingleTimeInput>
                <input
                  type="number"
                  value={breakTimeLastOrderMinutes ?? ''}
                  onChange={(e) =>
                    setBreakTimeLastOrderMinutes(e.target.value ?? null)
                  }
                />
                <span>분전</span>
              </UIStyles.setting.SingleTimeInput>
            </S.InnerSectionItem>
            <S.TextAreasContainer>
              <div>
                <p>주문 마감 사전 안내 메세지</p>
                <textarea />
              </div>
              <div>
                <p>영업마감 안내 메세지</p>
                <textarea />
              </div>
            </S.TextAreasContainer>
          </S.InnerSection>
        )}
      </div>
    </SectionWrapper>
  );
};

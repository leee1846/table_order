import {
  useCallback,
  useState,
  useRef,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import {
  extractNumbers,
  parseTimeString,
  validateHour,
  validateMinute,
} from '@repo/util/time';

interface Props {
  /**
   * 다음 포커스할 input ref (optional)
   */
  nextRef?: React.RefObject<HTMLInputElement | null>;
}

interface Return {
  hour: string;
  minute: string;
  minuteRef: React.RefObject<HTMLInputElement | null>;
  setTime: (timeString: string | null | undefined) => void;
  handleHourChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMinuteChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMinuteKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * 시간 입력을 위한 커스텀 훅
 * 시/분 입력을 관리하고, 자동 포커스 이동 및 validation을 처리합니다.
 *
 * @param props - 훅 설정 옵션
 * @returns 시간 입력 상태 및 핸들러
 *
 * @example
 * ```tsx
 * const startTime = useTimeInput();
 * const endTime = useTimeInput({ nextRef: someOtherRef });
 *
 * <input value={startTime.hour} onChange={startTime.handleHourChange} />
 * <input ref={startTime.minuteRef} value={startTime.minute} onChange={startTime.handleMinuteChange} />
 * ```
 */
export const useTimeInput = (props?: Props): Return => {
  const { nextRef } = props || {};

  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const minuteRef = useRef<HTMLInputElement>(null);

  const setTime = useCallback((timeString: string | null | undefined) => {
    const sanitized = extractNumbers(timeString ?? '');
    const { hour: parsedHour, minute: parsedMinute } = parseTimeString(
      sanitized.length === 4 ? sanitized : ''
    );

    setHour(parsedHour);
    setMinute(parsedMinute);
  }, []);

  const handleHourChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = extractNumbers(e.target.value);

    if (value === '') {
      setHour('');
      return;
    }

    const validated = validateHour(value);
    setHour(validated);

    // 2자리 입력 완료 시 다음 필드로 포커스 이동
    if (validated.length === 2) {
      minuteRef.current?.focus();
    }
  };

  const handleMinuteChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = extractNumbers(e.target.value);

    if (value === '') {
      setMinute('');
      return;
    }

    const validated = validateMinute(value);
    setMinute(validated);

    // 2자리 입력 완료 시 다음 필드로 포커스 이동 (nextRef가 있는 경우)
    if (validated.length === 2 && nextRef) {
      nextRef.current?.focus();
    }
  };

  const handleMinuteKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 빈 상태에서 backspace 누르면 hour 필드로 포커스 이동
    if (e.key === 'Backspace' && minute === '') {
      e.preventDefault();
      const hourInput = minuteRef.current?.previousElementSibling
        ?.previousElementSibling as HTMLInputElement;
      hourInput?.focus();
    }
  };

  return {
    hour,
    minute,
    minuteRef,
    setTime,
    handleHourChange,
    handleMinuteChange,
    handleMinuteKeyDown,
  };
};

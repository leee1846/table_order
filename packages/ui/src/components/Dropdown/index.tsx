import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import * as S from './dropdown.style';
import { SerializedStyles } from '@emotion/react';
import { ArrowDropDownIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';

export interface IOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface Props {
  options: IOption[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  customStyle?: SerializedStyles;
}

type TListDirection = 'up' | 'down';
type TListPosition = 'left' | 'right';

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = '선택',
  disabled = false,
  customStyle,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [listDirection, setListDirection] = useState<TListDirection>('down');
  const [listPosition, setListPosition] = useState<TListPosition>('left');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optionRef = useRef<HTMLLIElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (selectedValue: string | number) => {
    onChange?.(selectedValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (disabled) {
      return;
    }
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useLayoutEffect(() => {
    if (
      !isOpen ||
      !dropdownRef.current ||
      !listRef.current ||
      !optionRef.current
    ) {
      return;
    }

    const calculateListDirection = (triggerRect: DOMRect): TListDirection => {
      const screenCenterY = window.innerHeight / 2;
      const triggerCenterY = triggerRect.top + triggerRect.height / 2;
      return triggerCenterY < screenCenterY ? 'down' : 'up';
    };

    const calculateListPosition = (triggerRect: DOMRect): TListPosition => {
      const screenCenterX = window.innerWidth / 2;
      const triggerCenterX = triggerRect.left + triggerRect.width / 2;
      return triggerCenterX < screenCenterX ? 'left' : 'right';
    };

    const triggerRect = dropdownRef.current.getBoundingClientRect();

    // 화면 절반 기준으로 방향 계산
    const direction = calculateListDirection(triggerRect);
    const position = calculateListPosition(triggerRect);

    setListDirection(direction);
    setListPosition(position);

    const optionHeight = optionRef.current.offsetHeight;
    listRef.current.style.setProperty('--option-height', `${optionHeight}px`);
  }, [isOpen, options.length]);

  /** 외부 클릭 감지  */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <S.Container ref={dropdownRef} css={customStyle}>
      <S.Trigger
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        isOpen={isOpen}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ArrowDropDownIcon
          color={disabled ? theme.colors.grey[400] : theme.colors.grey[500]}
          width={20}
          height={20}
        />
      </S.Trigger>

      {isOpen && !disabled && (
        <S.List ref={listRef} direction={listDirection} position={listPosition}>
          {options.map((option, index) => (
            <S.Option
              key={option.value}
              ref={index === 0 ? optionRef : undefined}
              isSelected={option.value === value}
              onClick={() => !option.disabled && handleSelect(option.value)}
            >
              {option.label}
            </S.Option>
          ))}
        </S.List>
      )}
    </S.Container>
  );
};

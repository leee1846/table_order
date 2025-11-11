import { useState, useRef, useEffect } from 'react';
import * as S from './dropdown.style';
import { SerializedStyles } from '@emotion/react';
import { KeyboardArrowDownIcon } from '@repo/ui/icons';
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
  listPosition?: 'left' | 'right';
  customStyle?: SerializedStyles;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = '선택',
  disabled = false,
  listPosition = 'left',
  customStyle,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (selectedValue: string | number) => {
    onChange?.(selectedValue);
    setIsOpen(false);
  };

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled) {
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <S.Container ref={dropdownRef} css={customStyle}>
      <S.Trigger type="button" onClick={handleToggle} disabled={disabled}>
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <KeyboardArrowDownIcon
          color={disabled ? theme.colors.grey[400] : theme.colors.grey[500]}
          width={20}
          height={20}
        />
      </S.Trigger>

      {isOpen && !disabled && (
        <S.List position={listPosition}>
          {options.map((option) => (
            <S.Option
              key={option.value}
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

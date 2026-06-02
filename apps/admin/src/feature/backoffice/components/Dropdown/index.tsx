import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { ArrowDropDownIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from './dropdown.styles';

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
}

type TListDirection = 'up' | 'down';
type TListPosition = 'left' | 'right';

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = '선택',
  disabled = false,
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
    if (!isOpen || !dropdownRef.current || !listRef.current) {
      return;
    }

    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const listRect = listRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // 방향 결정 (리스트 높이를 고려)
    const spaceBelow = viewportHeight - dropdownRect.bottom;
    const spaceAbove = dropdownRect.top;
    const estimatedListHeight = Math.min(listRect.height || 200, 200);

    if (spaceBelow < estimatedListHeight && spaceAbove > spaceBelow) {
      setListDirection('up');
    } else {
      setListDirection('down');
    }

    // 위치 결정
    if (dropdownRect.right + (listRect.width || 200) > viewportWidth) {
      setListPosition('right');
    } else {
      setListPosition('left');
    }
  }, [isOpen, options.length]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <S.Container ref={dropdownRef}>
      <S.Trigger
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        isOpen={isOpen}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ArrowDropDownIcon
          color={disabled ? theme.colors.grey[400] : theme.colors.grey[500]}
          width={16}
          height={16}
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
              disabled={option.disabled}
            >
              {option.label}
            </S.Option>
          ))}
        </S.List>
      )}
    </S.Container>
  );
};

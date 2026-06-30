import React, { useState, useRef, useLayoutEffect } from 'react';
import { Tooltip, Button } from 'antd';
import styled from '@emotion/styled';

// --- Emotion Styles ---
const GroupButton = styled(Button)<{ 'data-active'?: boolean }>`
  width: 100%;
  text-align: center;

  ${({ 'data-active': active }) =>
    active
      ? `
        background-color: #1d2a6d;
        color: #fff;
        border-color: #1d2a6d;
        font-weight: 600;
        &:hover, &:focus {
          background-color: #1d2a6d;
          color: #fff;
          opacity: 0.9;
        }
      `
      : `
        background-color: #fff;
        color: #8c8c8c;
        border-color: #d9d9d9;
      `}
`;

const GroupButtonContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const TruncatedText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// --- Component Props ---
interface GroupButtonItemProps {
  group: {
    menuGroupSeq: number;
    menuGroupName: string;
    menuGroupTag: string;
  };
  isActive: boolean;
  onClick: () => void;
}

// --- Component ---
const GroupButtonItem: React.FC<GroupButtonItemProps> = ({
  group,
  isActive,
  onClick,
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    }
  }, [group.menuGroupName]);

  return (
    <Tooltip
      title={
        isOverflowing ? `${group.menuGroupName} (${group.menuGroupTag})` : ''
      }
      //styles={{ root: { whiteSpace: 'nowrap' } }}
    >
      <GroupButton data-active={isActive} onClick={onClick} size="large">
        <GroupButtonContent>
          <TruncatedText ref={textRef}>{group.menuGroupName}</TruncatedText>
          <span style={{ flexShrink: 0, marginLeft: '4px' }}>
            ({group.menuGroupTag})
          </span>
        </GroupButtonContent>
      </GroupButton>
    </Tooltip>
  );
};

export default GroupButtonItem;

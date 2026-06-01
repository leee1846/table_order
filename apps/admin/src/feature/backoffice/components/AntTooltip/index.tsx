import { memo, type ReactNode } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip, type TooltipProps } from 'antd';
import { theme } from '@repo/ui';
import { CapacitorApp } from '@repo/util/app';

const TRIGGER_NATIVE: NonNullable<TooltipProps['trigger']> = ['click'];

/** 웹: 마우스 호버 */
const TRIGGER_WEB: NonNullable<TooltipProps['trigger']> = ['hover', 'focus'];

/** 안내 아이콘 공통 크기(px) */
const DEFAULT_ICON_SIZE = 18;

/** 안내 아이콘 공통 색상 */
const DEFAULT_ICON_COLOR = theme.colors.grey[500];

export type AntTooltipProps = {
  title: ReactNode;
  placement?: TooltipProps['placement'];
  iconSize?: number;
  iconColor?: string;
  'aria-label'?: string;
};

const AntTooltipInner = ({
  title,
  placement = 'top',
  iconSize = DEFAULT_ICON_SIZE,
  iconColor = DEFAULT_ICON_COLOR,
  'aria-label': ariaLabel,
}: AntTooltipProps) => {
  const isNative = CapacitorApp.isNative();

  const resolvedAria =
    ariaLabel ?? (typeof title === 'string' ? title : undefined);

  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={{ pointAtCenter: true }}
      trigger={isNative ? TRIGGER_NATIVE : TRIGGER_WEB}
      mouseLeaveDelay={0.05}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          lineHeight: 0,
          cursor: 'pointer',
          verticalAlign: 'middle',
        }}
        tabIndex={0}
        role="img"
        aria-label={resolvedAria}
      >
        <InfoCircleOutlined style={{ fontSize: iconSize, color: iconColor }} />
      </span>
    </Tooltip>
  );
};

export const AntTooltip = memo(AntTooltipInner);

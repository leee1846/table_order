import { Switch, type SwitchProps } from 'antd';

export interface SettingSwitchProps extends Omit<
  SwitchProps,
  'checkedChildren' | 'unCheckedChildren'
> {
  checked: boolean;
}

export const SettingSwitch = ({
  checked,
  style,
  ...props
}: SettingSwitchProps) => {
  return (
    <Switch
      checkedChildren="on"
      unCheckedChildren="off"
      checked={checked}
      style={{ ...style }}
      {...props}
    />
  );
};

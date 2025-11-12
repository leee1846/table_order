import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { AddIcon, DeleteIcon, EditIcon } from '@repo/ui/icons';
import { css } from '@emotion/react';

const optionButtonCss = css`
  width: 42px;
  height: 42px;
`;

export const OptionSetting = () => {
  const IS_OPTION_EXIST = false;

  if (!IS_OPTION_EXIST) {
    <div>
      <p>옵션 설정</p>
      <div>
        <button type="button">
          <AddIcon width={20} height={20} color={theme.colors.grey[600]} />
          <span>옵션 그룹 추가</span>
        </button>
      </div>
    </div>;
  }

  return (
    <div>
      <div>
        <p>옵션 그룹 설정</p>
        <BasicButton
          variant="Solid_Sky_Blue_2XL"
          icon={
            <AddIcon width={16} height={16} color={theme.colors.grey[200]} />
          }
        >
          옵션 그룹 추가하기
        </BasicButton>
      </div>

      <ul>
        <li>
          <div>
            <p>옵션 그룹 이름</p>

            <span>옵션 이름,옵션 이름,옵션 이름,옵션 이름,옵션 이름</span>
          </div>

          <div>
            <BasicButton
              variant="Outline_Grey_XL"
              icon={
                <EditIcon
                  width={22}
                  height={22}
                  color={theme.colors.grey[700]}
                />
              }
              customStyle={optionButtonCss}
            />
            <BasicButton
              variant="Outline_Grey_XL"
              icon={
                <DeleteIcon
                  width={22}
                  height={22}
                  color={theme.colors.grey[700]}
                />
              }
              customStyle={optionButtonCss}
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

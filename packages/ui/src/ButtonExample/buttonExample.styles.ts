import styled from '@emotion/styled';

export const StyledButton = styled.button<{
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  fullWidth: boolean;
}>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  user-select: none;

  /* Size variants */
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          font-size: ${theme.typography.fontSize.sm};
          height: 32px;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing[3]} ${theme.spacing[6]};
          font-size: ${theme.typography.fontSize.lg};
          height: 48px;
        `;
      default:
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.typography.fontSize.base};
          height: 40px;
        `;
    }
  }}

  /* Color variants */
  ${({ variant, theme, disabled }) => {
    if (disabled) {
      return `
        background-color: ${theme.colors.grey[200]};
        color: ${theme.colors.grey[400]};
        cursor: not-allowed;
        opacity: 0.6;
      `;
    }

    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrastText};
          box-shadow: ${theme.shadows.sm};

          &:hover {
            background-color: ${theme.colors.primary.dark};
            box-shadow: ${theme.shadows.md};
            transform: translateY(-1px);
          }

          &:active {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary.main};
          color: ${theme.colors.secondary.contrastText};
          box-shadow: ${theme.shadows.sm};

          &:hover {
            background-color: ${theme.colors.secondary.dark};
            box-shadow: ${theme.shadows.md};
            transform: translateY(-1px);
          }

          &:active {
            transform: translateY(0);
            box-shadow: ${theme.shadows.sm};
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${theme.colors.primary.main};
          border-color: ${theme.colors.primary.main};

          &:hover {
            background-color: ${theme.colors.primary.main};
            color: ${theme.colors.primary.contrastText};
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: ${theme.colors.text.primary};

          &:hover {
            background-color: ${theme.colors.grey[100]};
          }

          &:active {
            background-color: ${theme.colors.grey[200]};
          }
        `;
    }
  }}

  /* Full width */
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}

  /* Focus styles */
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }
`;

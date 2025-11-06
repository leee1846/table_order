import styled from '@emotion/styled';

export const ButtonStyle = styled.button<{
  variant: 'navy' | 'outline' | 'skyBlue' | 'outlineGrey';
  size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  disabled: boolean;
}>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  user-select: none;

  /* Full width */

  /* Focus styles */
  &:focus-visible {
    outline-offset: 2px;
  }
`;

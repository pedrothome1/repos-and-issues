import styled, { keyframes, css } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export default styled.button.attrs(props => ({
  type: props.type || 'button',
  disabled: props.loading || props.disabled || 0,
  onClick: props.onClick,
}))`
  background: #7159c1;
  color: #fff;
  border: 0;
  padding: 0 15px;
  border-radius: 4px;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

import styled from 'styled-components';

export default styled.div`
  margin-top: 20px;
  display: flex;
  align-items: stretch;

  button {
    padding-top: 10px;
    padding-bottom: 10px;

    & + button {
      margin-left: 10px;
    }
  }
`;

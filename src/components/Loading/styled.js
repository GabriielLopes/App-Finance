/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  bottom: 0;

  svg {
    z-index: 1;
  }
`;

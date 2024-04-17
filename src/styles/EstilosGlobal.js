// eslint-disable-next-line import/no-extraneous-dependencies
import styled, { createGlobalStyle } from 'styled-components';

import * as colors from '../config/colors';

// eslint-disable-next-line import/prefer-default-export
export const EstilosGlobal = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: none;
    box-sizing: border-box;
  }

  body {
    font-family: 'sans-serif';
    background-color: ${colors.primaryDarkColor};
  }

  html, border-style, #root {
    height: 100%;
  }

  button {
    cursor: pointer;
    background-color: ${colors.primaryColor};
    border: none;
    color: #fff;
    padding: 10px 20px;
    border-radius: 4px;
  }

  a {
    text-decoration: none;
  }

  ul {
    list-style: none;
  }



`;

export const Container = styled.div`
  max-width: 550px;
  background-color: #fff;
  margin: 30px auto;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

// eslint-disable-next-line import/no-extraneous-dependencies
import styled, { createGlobalStyle } from 'styled-components';


// eslint-disable-next-line import/prefer-default-export
export const EstilosGlobal = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: none;
    box-sizing: border-box;
    pointer-events: auto;
  }

  body {
    font-family: 'sans-serif';
  }

   .pages_content {
    position: absolute;
    height: 100%;
    width: calc(100% - 60px);
    left: 100px;
    margin-top: 1%;
    transition: all 0.45s ease;
    overflow: auto
  }

  .pages_content h1 {
    text-align: center;
    font-size: 35px;
  }

  .sidebar.active ~ .pages_content {
    width: calc(100% - 270px);
    left: 250px
  }

`;

export const Container = styled.div`
  max-width: 550px;
  background-color: #fff;
  margin: 30px auto;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

`;

/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const Body = styled.body`
  background-color: black;
`;

export const Btn = styled.div`
  background-image: linear-gradient(125deg, #fff, #e6e8fa);
  position: absolute;
  width: 100%;
  height: 100%;

  .container-login {
    font-family: 'Josefin Sans', sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    max-width: 550px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    padding: 15px;
    margin: 0 auto;
    margin-top: 10%;
  }

  button {
    cursor: pointer;
    background-color: #003566;
    width: 250px;
    border: none;
    color: #fff;
    padding: 10px 20px;
    border-radius: 10px;
  }

  button:hover {
    background-color: #11101D;
  }

  button:active {
    background-color: #001d3d;
  }

  input {
    width: 100%;
    height: 35px;
    padding: 5px;
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-radius: 5px;
  }

  input:hover {
    transition: 0.3s ease-in-out;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.3);
  }

  input:focus {
    transition: 0.3s ease-in-out;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.3);
  }

  h1 {
    text-align: center;
    font-size: 28px;
  }
`;

// eslint-disable-next-line import/no-extraneous-dependencies
import styled from 'styled-components';
import { primaryColor } from '../../config/colors';

// eslint-disable-next-line import/prefer-default-export
export const Nav = styled.nav`
  background-color: ${primaryColor};
  padding: 20px;
  display: flex;
  justify-content: flex-end;

  a {
    color: white;
    margin: 0 30px;
    font-weight: bold;
  }

  a:hover {
    color: grey;
  }
`;

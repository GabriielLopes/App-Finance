import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
// import ReactLoading from 'react-loading';
import ClipLoader from 'react-spinners/ClipLoader';

import { Container } from './styled';

export default function Loading({ isLoading }) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!isLoading) return <></>;
  return (
    // eslint-disable-next-line react/jsx-no-undef
    <Container>
      <ClipLoader  color="#0077b6" size={100} />
    </Container>
  );
}

Loading.defaultProps = {
  isLoading: false,
};

Loading.propTypes = {
  isLoading: PropTypes.bool,
};

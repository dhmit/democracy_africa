import React from 'react';
import * as PropTypes from 'prop-types';

function Score(props) {
  return (
    <div className="score">
      You got <strong>{props.quizResult}</strong>!
    </div>
  );
}

Result.propTypes = {
  quizResult: PropTypes.string.isRequired,
};

export default Result;

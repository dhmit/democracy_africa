import React from 'react';
import * as PropTypes from 'prop-types';

function Score(props) {
  return (
    <div className="score">
      You got <strong>{props.quizScore}</strong>!
    </div>
  );
}

Score.propTypes = {
  quizScore: PropTypes.string.isRequired,
};

export default Score;

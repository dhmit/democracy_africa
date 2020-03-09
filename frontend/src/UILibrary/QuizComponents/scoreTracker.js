import React from 'react';
import * as PropTypes from 'prop-types';

function ScoreTracker(props) {
    return (
        <div className="scoreTracker">
            <p>Question <span>{props.counter}</span> of <span>{props.total}</span></p>
            <p>Score <span>{props.correct}</span> of <span>{props.total}</span></p>
        </div>
    );
}

ScoreTracker.propTypes = {
    counter: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    correct: PropTypes.number.isRequired,
};

export default ScoreTracker;

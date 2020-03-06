import React from 'react';
import * as PropTypes from 'prop-types';

function AnswerChoices(props) {
    return (
        <li className="answerChoices">
            <input
                type="radio"
                className="radioCustomButton"
                name="radioGroup"
                checked={props.answerType === props.answer}
                value={props.answerType}
                disabled={props.answer}
                onChange={props.onAnswerSelected}
            />
            <label className="radioCustomLabel">
                {props.answerContent}
            </label>
        </li>
    );
}

AnswerChoices.propTypes = {
    answerType: PropTypes.bool.isRequired,
    answerContent: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    onAnswerSelected: PropTypes.func.isRequired
};

export default AnswerChoices;

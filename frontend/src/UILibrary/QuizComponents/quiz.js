import React from 'react';
import * as PropTypes from 'prop-types';

function Quiz(props) {
    return (
        <h2 className="question">{props.content}</h2>
    );
}

Quiz.propTypes ={
    content: PropTypes.string.isRequired
};

export default Quiz;

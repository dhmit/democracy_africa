import React from 'react';
import * as PropTypes from 'prop-types';

class QuestionContainer extends React.Component{
    constructor(){
        super();
        this.state = {
            completed: false,
        };
    }

    render(){
        return(
            <Question question={"Question 1"} answers={[1,2,3,4]} correct_answer={1}
                correct = {null}></Question>
        );
    }
}

class Question extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            correct: this.props.correct,
        };
    }

    render(){
        return(
            <div className="question-box">
                <p>{this.props.question}</p>

            </div>
        );
    }
}

Question.propTypes = {
    question: PropTypes.string,
    answers: PropTypes.array,
    correct_answer: PropTypes.number,
    correct: PropTypes.bool,
};


import React from 'react';
import * as PropTypes from 'prop-types';

export class QuestionContainer extends React.Component{
    constructor(){
        super();
        this.state = {
            completed: false,
        };
    }

    render(){
        return(
            <Question
                question={this.props.question}
                answers={this.props.answers}
                correct_answer={this.props.correct_answer}
                correct = {this.props.correct}
            />
        );
    }
}

QuestionContainer.propTypes = {
    question: PropTypes.string,
    answers: PropTypes.array,
    correct_answer: PropTypes.number,
    correct: PropTypes.bool,
};

class Question extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            correct: this.props.correct,
        };
    }

    render(){
        console.log(this.props.question);
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

class AnswerChoices extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            choices: this.props.options,
            correct: this.props.correct,
        };
    }

    render() {
        return(
            <button
                onClick={() =>
                    this.props.setStage(stage, option)}
            >{this.props.option.text}</button>
        )
    }
}

AnswerChoices.propTypes ={
    options: PropTypes.object,
    correct: PropTypes.bool,
};

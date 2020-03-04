import React from 'react';
import * as PropTypes from 'prop-types';
import Quiz from "quiz";
import ScoreTracker from "scoreTracker";
import AnswerChoices from "answerChoices";

function QuizFrame(props) {
    function renderAnswerChoices(key) {
        return (
            <AnswerChoices
                key={key.content}
                answerContent={key.content}
                answerType={key.type}
                answer={props.answer}
                questionId={props.questionId}
                onAnswerSelected={props.onAnswerSelected}
            />
        );
    }

    return (
        <div className="quizFrame">
            <ScoreTracker
                counter={props.questionId}
                total={props.questionTotal}
                correct={props.correctAnswers}
            />
            <Quiz content={props.question} />
            <ul className="answerChoices">
                {props.answerChoices.map(renderAnswerChoices)}
            </ul>
        </div>
    );
}

QuizFrame.propTypes = {
    answer: PropTypes.string.isRequired,
    answerChoices: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    questionId: PropTypes.number.isRequired,
    questionTotal: PropTypes.number.isRequired,
    onAnswerSelected: PropTypes.func.isRequired,
    correctAnswers: PropTypes.number.isRequired,
};

export default QuizFrame;

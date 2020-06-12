import React from 'react';
import * as PropTypes from 'prop-types';
import Citizen from './citizen';

class Feedback extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { results, clickedProvince } = this.props;
        let citizenReactions;
        if (clickedProvince) {
            const sample = results[clickedProvince]['citizens'].slice(0, 100);
            citizenReactions = sample.map((citizen, k) => (
                <Citizen
                    key={k}
                    data={citizen}
                    title={`Citizen of ${citizen['province']}`}
                    generateDescription={this.props.generateDescription}
                />
            ));
        }
        const description = (<div>
            {clickedProvince
                ? (<strong>
                    Round {this.props.round - 1} results for {clickedProvince}
                </strong>)
                : (<></>)}
        </div>);

        return (
            <div className='feedback'>
                <div className='feedback-results'>
                    <p>
                    Click on a province, and then mouse over citizens to see their reactions to your
                    proposal.
                    </p>

                    {description}
                    <div className='feedback-pop'>{citizenReactions}</div>
                </div>
                <button className='campaign-btn' onClick={this.props.nextRound}>
                    Next Round
                </button>
            </div>
        );
    }
}
Feedback.propTypes = {
    clickedProvince: PropTypes.string,
    generateDescription: PropTypes.func,
    results: PropTypes.object,
    round: PropTypes.number,
    nextRound: PropTypes.func,
};

export default Feedback;

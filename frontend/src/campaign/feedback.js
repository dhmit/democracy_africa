import React from 'react';
import * as PropTypes from 'prop-types';

class Feedback extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            feedbackTable, citizenReactions, clickedProvince, campaignMap,
        } = this.props;

        const description = (<div>
            {clickedProvince
                ? (<strong>
                    Round {this.props.round - 1} Polling Results For {clickedProvince}
                </strong>)
                : (<></>)}
        </div>);

        const instruction = 'Click on a province to see what our polling found out about how'
            + ' satisfied a sample of citizens from that province were with'
            + ' your priorities.';

        return (
            <div className='feedback container'>
                <div className="row" style={{ width: '100%' }}>
                    <div className="feedback-results col-lg-6 col-md-12 order-12 order-lg-1">
                        <p className="feedback-instructions d-none d-lg-block">
                            {instruction}
                        </p>
                        { clickedProvince
                            && <strong className="citizen-text">
                                A Sample of the Citizens from { clickedProvince }
                            </strong>
                        }
                        <div className="citizen-reactions">
                            {citizenReactions}
                        </div>
                        {description}
                        { clickedProvince && feedbackTable}
                        <button
                            className='campaign-btn d-none d-lg-block'
                            onClick={this.props.nextRound}
                        >
                            Next Round
                        </button>
                        <button
                            className='campaign-btn d-block d-lg-none w-100'
                            onClick={this.props.nextRound}
                        >
                            Next Round
                        </button>
                    </div>
                    <div className="col-lg-6 col-md-12 map-col order-1 order-lg-12">
                        <p className="feedback-instructions d-block d-lg-none">
                            {instruction}
                        </p>
                        {campaignMap}
                    </div>
                </div>
            </div>
        );
    }
}
Feedback.propTypes = {
    clickedProvince: PropTypes.string,
    generateDescription: PropTypes.func,
    round: PropTypes.number,
    nextRound: PropTypes.func,
    topicNames: PropTypes.array,
    speechProposal: PropTypes.object,
    campaignMap: PropTypes.object,
    feedbackTable: PropTypes.object,
    citizenReactions: PropTypes.object,
};

export default Feedback;

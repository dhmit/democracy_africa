import React from 'react';
import * as PropTypes from 'prop-types';

class Feedback extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { results, clickedProvince } = this.props;
        let sample = [];
        if (clickedProvince) {
            sample = results[clickedProvince]['citizens'].slice(0, 25);
            // citizenReactions = sample.map((citizen, k) => (
            //     <Citizen
            //         key={k}
            //         data={citizen}
            //         title={`Citizen of ${citizen['province']}`}
            //         generateDescription={this.props.generateDescription}
            //     />
            // ));
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
                    <div className='feedback-pop'>
                        {clickedProvince
                            && <table border="1" className={'feedback-table'}>
                                <tbody>
                                    <tr>
                                        <th>Citizen Number</th>
                                        <th>Satisfied With Your Stance On</th>
                                        <th>Wants You to Give More Priority To</th>
                                    </tr>
                                    {sample.map((citizen, k) => {
                                        const reaction = this.props.generateDescription(citizen);
                                        return (
                                            <tr key={k}>
                                                <td>{citizen.name}</td>
                                                <td>
                                                    {reaction[0].map((topic, j) => (
                                                        <span key={j}>{topic}<br/></span>
                                                    ))}
                                                </td>
                                                <td>
                                                    {reaction[1].map((topic, j) => (
                                                        <span key={j}>{topic}<br/></span>
                                                    ))}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        }

                    </div>
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

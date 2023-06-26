import React from 'react';
import * as PropTypes from 'prop-types';

export const COUNTRIES = [
    {
        name: 'Botswana',
        ISO: 'BWA',
        population: '2.254 million',
        difficulty: 'Easy',
        topicNames: [
            'Education',
            'Creating jobs',
            'Fighting corruption',
        ],
        supportThreshold: 0.5,
        max_priority_points: { 'low': 3, 'medium': 3, 'high': 2 },
        election_date: 'October 23rd',
    },
    {
        name: 'Kenya',
        ISO: 'KEN',
        population: '51.39 million',
        difficulty: 'Medium',
        topicNames: [
            'Health services',
            'Education',
            'Water and sanitation',
            'Equal rights for women',
            'Creating jobs',
            'Fighting corruption',
        ],
        supportThreshold: 6,
        max_priority_points: { 'low': 6, 'medium': 3, 'high': 2 },
        election_date: 'August 8th',
    },
    {
        name: 'South Africa',
        ISO: 'ZAF',
        population: '57.78 million',
        difficulty: 'Hard',
        topicNames: [
            'Health services',
            'Education',
            'Water and sanitation',
            'Roads and bridges',
            'Electricity',
            'Equal rights for women',
            'Improving living standards for the poor',
            'Creating jobs',
            'Fighting corruption',
            'Reducing violent community conflict',
        ],
        supportThreshold: 25,
        max_priority_points: { 'low': 10, 'medium': 5, 'high': 3 },
        election_date: 'May 8th',
    },
];

export function get_country_prop(country_name, prop_name) {
    // Each country has its own set of topicNames
    const country = COUNTRIES.filter((obj) => {
        return obj.name === country_name;
    })[0];
    return country[prop_name];
}

export const get_default_proposal = (topic_names) => {
    const proposal = {};
    topic_names.forEach((topic) => {
        proposal[topic] = 0;
    });
    return proposal;
};

function getOrdinalIndicator(day) {
    let suffix = 'th';
    const exceptions = [11, 12, 13];
    if (!(exceptions.includes(day))) {
        if (day % 10 === 1) {
            suffix = 'st';
        } else if (day % 10 === 2) {
            suffix = 'nd';
        } else if (day % 10 === 3) {
            suffix = 'rd';
        }
    }
    return suffix;
}

function getMaxNumberOfDays(monthIndex) {
    if (monthIndex === 1) {
        return 28;
    }
    if ([3, 5, 8, 10].includes(monthIndex)) {
        return 30;
    }
    return 31;
}

function ColumnHeader(props) {
    let textClass;
    if (props.currentValue > props.maxAllowed) {
        textClass = 'text-danger font-weight-bold';
    } else if (props.currentValue === props.maxAllowed) {
        textClass = 'text-dark font-weight-bold';
    } else {
        textClass = 'text-dark';
    }

    return (
        <div className='text-center'>
            {props.heading}<br/>
            <span className={`priority-nums ${textClass}`}>
                {props.currentValue} / {props.maxAllowed}
            </span>
        </div>
    );
}
ColumnHeader.propTypes = {
    heading: PropTypes.string,
    currentValue: PropTypes.number,
    maxAllowed: PropTypes.number,
};


export class Speech extends React.Component {
    constructor(props) {
        super(props);
        this.max_priority_points = get_country_prop(this.props.countryName, 'max_priority_points');
        const bucketPriorities = this.makeBucketedProposalDict(this.props.rawSpeechProposal);
        this.state = {
            rawSpeechProposal: this.props.rawSpeechProposal,
            bucketPriorities: bucketPriorities,
            result: 0,
            total: Object.keys(this.props.rawSpeechProposal).reduce((acc, topic) => {
                return acc + this.props.rawSpeechProposal[topic];
            }, 0),
            roundDates: [null, null, null, null],
            cannotSubmitError: ' ',
        };
        this.difference_threshold = get_country_prop(this.props.countryName, 'supportThreshold');
        this.electionDate = get_country_prop(this.props.countryName, 'election_date');
    }

    /**
     * Resets the speech such that every topic has a value of 1.
     * Used when component mounts and upon onClick of a button
     */
    resetSpeech = () => {
        this.setState({
            rawSpeechProposal: get_default_proposal(this.props.topicNames),
            total: 30,
        }, () => {
            this.setState({ result: this.countSupporters() });
        });
    };

    componentDidMount() {
        if (this.props.canReset) {
            this.countSupporters(); // in the case that user changed nothing
        }
    }

    getCurrentDate() {
        if (this.state.roundDates[this.props.round] !== null) {
            return this.state.roundDates[this.props.round];
        }
        const monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'];
        const electionMonth = this.electionDate.split(' ')[0];
        const electionMonthIndex = monthsArray.indexOf(electionMonth);
        const maxNumberOfDays = getMaxNumberOfDays(electionMonthIndex);
        const newRoundDates = this.state.roundDates;
        const currentDay = Math.round(Math.random() * (maxNumberOfDays - 1)) + 1;
        let currentMonth = '';
        if (this.props.round === 1) {
            let monthIndex = Math.round(Math.random()
                * (electionMonthIndex - 5));
            if (monthIndex < 0) {
                monthIndex = 0;
            }
            currentMonth = monthsArray[monthIndex];
        } else if (this.props.round === 2) {
            currentMonth = monthsArray[electionMonthIndex - 2];
        }
        const currentDate = `${currentMonth} ${currentDay}${getOrdinalIndicator(currentDay)}`;
        newRoundDates[this.props.round] = currentDate;
        this.setState({
            roundDates: newRoundDates,
        });
        return currentDate;
    }

    generateStory() {
        const previousRoundSupport = Math.round(
            (this.props.roundAggregateData[this.props.round - 1].totalSupport
                / this.props.roundAggregateData[this.props.round - 1].totalPopulation) * 100,
        );
        let storyText = '';
        const currentDate = this.getCurrentDate();
        if (this.props.round === 1) {
            storyText += `It is currently ${currentDate}. `
                + 'You just started your campaign and we want you to set out '
                + 'your policies so that we can conduct polls to gauge the initial reaction. '
                + 'You anticipate being able to do three rounds of polls before election '
                + `day on ${this.electionDate}.`;
        } else if (this.props.round === 2) {
            storyText += `It is currently ${currentDate} and you decide it `
                + 'is time for the next poll. ';
        } else if (this.props.round === 3) {
            storyText += 'It is one month before election day and you have enough time for one '
                + 'more poll as predicted. ';
        }
        let constantSupport = false;
        if (this.props.round === 3) {
            const roundOneSupport = Math.round(
                (this.props.roundAggregateData[1].totalSupport
                    / this.props.roundAggregateData[1].totalPopulation) * 100,
            );
            if (roundOneSupport < previousRoundSupport) {
                storyText += 'Results show that overall, people think your policy has improved. ';
                if (previousRoundSupport >= 60) {
                    storyText += 'Based on the results from last round, people seem to respond '
                        + 'very well to the current policy. This policy is probably what you want '
                        + 'to use in the election.';
                } else if (previousRoundSupport >= 50 && previousRoundSupport < 60) {
                    storyText += 'Most people seem to respond well to this policy. You may '
                        + 'still want to make some other adjustments and see if that will improve '
                        + 'your support.';
                } else if (previousRoundSupport >= 30 && previousRoundSupport < 50) {
                    storyText += 'However, most people do not seem to respond well to this policy. '
                        + 'You should make some policy adjustments before the election.';
                } else if (previousRoundSupport > 0 && previousRoundSupport < 30) {
                    storyText += 'However, almost no one supports your current policy. You '
                        + 'should make some adjustments before you submit your final policy.';
                } else if (previousRoundSupport === 0) {
                    storyText += 'No one supports your policy. You should make'
                        + ' some adjustments before you submit your final policy.';
                }
            } else if (roundOneSupport > previousRoundSupport) {
                storyText += 'Results show that overall, people think your policy has declined. ';
                if (previousRoundSupport >= 60) {
                    storyText += 'However, based on the results from last round, people still '
                        + 'seem to respond very well to the current policy.';
                } else if (previousRoundSupport >= 50 && previousRoundSupport < 60) {
                    storyText += 'However, most people still seem to respond well to this policy.';
                } else if (previousRoundSupport >= 30 && previousRoundSupport < 50) {
                    storyText += 'Most people do not seem to respond well to this policy. You '
                        + 'should return to your previous policy or rethink your strategy.';
                } else if (previousRoundSupport > 0 && previousRoundSupport < 30) {
                    storyText += 'Almost no one supports your current policy. You should return '
                        + 'to your previous policy or rethink your strategy.';
                } else if (previousRoundSupport === 0) {
                    storyText += 'No one supports this policy. You should return to your previous '
                        + 'policy or rethink your strategy.';
                }
            } else {
                constantSupport = true;
            }
        }
        if (this.props.round === 2 || constantSupport) {
            if (previousRoundSupport >= 60) {
                storyText += 'Based on the results from last round, people seem to respond '
                    + 'very well to the current policy. This policy is probably what you want to '
                    + 'use in the election.';
            } else if (previousRoundSupport >= 50 && previousRoundSupport < 60) {
                storyText += 'Most people seem to respond well to this policy. You may '
                    + 'still want to make some other adjustments and see if that will improve '
                    + 'your support.';
            } else if (previousRoundSupport >= 30 && previousRoundSupport < 50) {
                storyText += 'Most people do not seem to respond well to this policy. You should '
                    + 'make some adjustments before you submit your final policy.';
            } else if (previousRoundSupport > 0 && previousRoundSupport < 30) {
                storyText += 'Almost no one supports your current policy. You should make '
                    + 'some adjustments before you submit your final policy.';
            } else if (previousRoundSupport === 0) {
                storyText += 'No one supports your policy. You should make '
                    + 'some adjustments before you submit your final policy.';
            }
        }
        return storyText;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.countryName !== this.props.countryName) {
            this.resetSpeech();
        }
        if (prevProps.countryName !== this.props.countryName
            || prevProps.population !== this.props.population) {
            this.setState({
                result: this.countSupporters(),
            });
        }
    }

    makeBucketedProposalDict(speech) {
        // Takes raw values from proposal which are 1-5, and maps those to 'low', 'medium', 'high'

        const dict = {
            'low': 0, 'medium': 0, 'high': 0,
        };
        for (const topic of Object.keys(speech)) {
            if (speech[topic] === 1) {
                dict['low'] += 1;
            } else if (speech[topic] === 3) {
                dict['medium'] += 1;
            } else if (speech[topic] === 5) {
                dict['high'] += 1;
            }
        }
        return dict;
    }

    validateSpeech = () => {
        const proposalDict = this.state.bucketPriorities;
        const unacceptable_priorities = [];
        for (const priority of Object.keys(this.max_priority_points)) {
            if (proposalDict[priority] > this.max_priority_points[priority]) {
                unacceptable_priorities.push(priority);
            }
        }

        if (unacceptable_priorities.length === 0) {
            this.props.submitPriorities();
        } else {
            let cannotSubmitError = 'You have too many ';
            for (let i = 0; i < unacceptable_priorities.length; i++) {
                cannotSubmitError += unacceptable_priorities[i];
                if (i === unacceptable_priorities.length - 2) {
                    cannotSubmitError += ' and ';
                } else if (i < unacceptable_priorities.length - 1
                    && unacceptable_priorities.length > 2) {
                    cannotSubmitError += ', ';
                }
            }
            cannotSubmitError += ' priority sectors.';
            this.setState({ cannotSubmitError });
        }
    };

    /**
     * Handles when the slider changes by changing the state of what the maximum values should
     * be for each category and updates the number of supporters
     * @param e The event that is triggered, use e.target.value to get the value of the slider
     * @param topic Tells which topic the slider belongs to so that it updates the speech
     */
    handleButtonOnChange = (e, topic) => {
        // Update value of raw proposal dict
        const newProposal = this.props.rawSpeechProposal;
        const newVal = parseInt(e.target.value);
        const oldVal = newProposal[topic];
        newProposal[topic] = newVal;
        const bucketPriorities = this.makeBucketedProposalDict(newProposal);

        this.setState({
            rawSpeechProposal: newProposal,
            bucketPriorities: bucketPriorities,
            cannotSubmitError: ' ',
            total: this.state.total + newVal - oldVal,
            result: this.countSupporters(),
        });
    };

    /**
     * Determines whether a citizen will support you based on your speech.
     * @returns {number} Number of people that will support you
     */
    countSupporters = () => {
        let count = 0;
        Object.keys(this.props.population).forEach((province) => {
            let numSupporters = 0;
            this.props.population[province]['citizens'].forEach((citizen) => {
                let difference_score = 0;
                for (const topic of Object.keys(this.state.rawSpeechProposal)) {
                    if (this.state.rawSpeechProposal[topic] < citizen['traits'][topic]) {
                        difference_score += (citizen['traits'][topic]
                            - this.state.rawSpeechProposal[topic]) ** 2;
                    }
                }

                if (difference_score > this.difference_threshold) {
                    citizen.will_support = false;
                } else {
                    citizen.will_support = true;
                    numSupporters += 1;
                    count++;
                }
            });
            this.props.population[province]['totalSupporters'] = numSupporters;
        });

        this.props.updatePopulation(this.props.population);
        return count;
    };

    render() {
        const topics = this.props.topicNames.map((topic, key) => {
            const inputs = [];
            for (let i = 0; i < 3; i++) {
                inputs.push(<input
                    key={i}
                    className='speech-radio'
                    type='radio'
                    name={topic}
                    id={'inlineRadio' + (2 * i + 1)}
                    value={2 * i + 1}
                    checked={this.state.rawSpeechProposal[topic] === (2 * i + 1)}
                    onChange={(e) => this.handleButtonOnChange(e, topic)}
                />);
            }
            return (
                <div key={key} className='speech-option'>
                    <div className='speech-option_label'>
                        {topic}
                    </div>
                    <div className='speech-option_btns'>
                        {inputs}
                    </div>
                </div>
            );
        });


        return (
            <div className="row w-110">
                <div className='col-sm-12 col-lg-6' style={ { marginBottom: '20px' } }>
                    <div className='speech-context'>
                        <p className='speech-context_count'>
                            {this.generateStory()}
                        </p>
                    </div>
                    <div className='speech-warning d-none d-lg-flex'>
                        <div className='speech-context_points text-danger'>
                            {this.state.cannotSubmitError}
                        </div>
                    </div>
                    <div className='speech-warning d-flex d-lg-none'>
                        <div className='speech-context_points_small text-danger'>
                            {this.state.cannotSubmitError}
                        </div>
                    </div>
                    <div className='speech-options'>
                        <div className='speech-option_label'></div>
                        <div className='speech-option_priority'>
                            <ColumnHeader
                                heading={'Low'}
                                currentValue={this.state.bucketPriorities.low}
                                maxAllowed={this.max_priority_points.low}
                            />
                            <ColumnHeader
                                heading={'Medium'}
                                currentValue={this.state.bucketPriorities.medium}
                                maxAllowed={this.max_priority_points.medium}
                            />
                            <ColumnHeader
                                heading={'High'}
                                currentValue={this.state.bucketPriorities.high}
                                maxAllowed={this.max_priority_points.high}
                            />
                        </div>
                        {topics}
                    </div>
                    <div className='reset_button d-none d-lg-flex'>
                        <button
                            className='campaign-btn speech-btn'
                            onClick={this.validateSpeech}
                        >
                            Submit
                        </button>
                    </div>
                    <div className='reset_button d-flex d-lg-none'>
                        <button
                            className='campaign-btn speech-btn w-100'
                            onClick={this.validateSpeech}
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <div className="col-sm-12 col-lg-6 d-none d-lg-block">
                    {this.props.campaign_map}
                </div>
            </div>
        );
    }
}
Speech.propTypes = {
    population: PropTypes.object,
    countryName: PropTypes.string,
    updatePopulation: PropTypes.func,
    submitPriorities: PropTypes.func,
    rawSpeechProposal: PropTypes.object,
    topicNames: PropTypes.array,
    canReset: PropTypes.bool,
    round: PropTypes.number,
    campaign_map: PropTypes.object,
    roundAggregateData: PropTypes.object,
};

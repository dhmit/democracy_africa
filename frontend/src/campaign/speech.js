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
        proposal[topic] = 1;
    });
    return proposal;
};

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
            <span className={textClass}>
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
            cannotSubmitError: '',
        };
        this.difference_threshold = get_country_prop(this.props.countryName, 'supportThreshold');
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

    generateStory() {
        if (this.props.round === 1) {
            return 'You just started your campaign and we want you to set out '
                    + 'your policies so that we can conduct polls to gauge the initial reaction.';
        }
        if (this.props.round === 2) {
            return 'We can do two more polls before elections.';
        }
        return 'This is the final policies that people will see in the election';
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
            // TODO: need commas / 'and' when we have multiple here
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
            <div className="row w-100">
                <div className='col-sm-12 col-lg-6'>
                    <div className='speech-context'>
                        <p className='speech-context_count'>
                            {this.generateStory()}
                        </p>
                    </div>
                    <div className='speech-options'>
                        <div className='speech-option-desc'>
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
                        <div className='speech-context_points text-danger text-right'>
                            {this.state.cannotSubmitError}
                        </div>
                        {topics}
                    </div>
                    <div className='reset_button'>
                        <button
                            className='campaign-btn speech-btn'
                            onClick={this.validateSpeech}
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <div className="col-sm-12 col-lg-6">
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
};


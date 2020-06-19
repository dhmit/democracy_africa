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


export class Speech extends React.Component {
    constructor(props) {
        super(props);
        this.max_priority_points = get_country_prop(this.props.countryName, 'max_priority_points');
        this.state = {
            speechProposal: this.props.speechProposal,
            result: 0,
            total: Object.keys(this.props.speechProposal).reduce((acc, topic) => {
                return acc + this.props.speechProposal[topic];
            }, 0),
            atMaxStatement: this.noProblem(this.makeProposalDict(this.props.speechProposal))[1],
        };
        this.difference_threshold = get_country_prop(this.props.countryName, 'supportThreshold');
    }

    /**
     * Resets the speech such that every topic has a value of 1.
     * Used when component mounts and upon onClick of a button
     */
    resetSpeech = () => {
        this.setState({
            speechProposal: get_default_proposal(this.props.topicNames),
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

    makeProposalDict(speech) {
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

    noProblem(dict) {
        let acceptable = true;
        let atMaxStatement = '';
        for (const priority of Object.keys(this.max_priority_points)) {
            if (dict[priority] > this.max_priority_points[priority]) {
                acceptable = false;
            } else {
                atMaxStatement += 'You can have ' + (this.max_priority_points[priority]
                    - dict[priority]) + ' more sectors at ' + priority + ' priority.\n';
            }
        }
        return [acceptable, atMaxStatement];
    }

    /**
     * Handles when the slider changes by changing the state of what the maximum values should
     * be for each category and updates the number of supporters
     * @param e The event that is triggered, use e.target.value to get the value of the slider
     * @param topic Tells which topic the slider belongs to so that it updates the speech
     */

    handleButtonOnChange = (e, topic) => {
        const newVal = parseInt(e.target.value);
        const newProposal = this.props.speechProposal;
        const oldVal = newProposal[topic];
        newProposal[topic] = newVal;
        const updateData = this.noProblem(this.makeProposalDict(newProposal));
        const acceptableConfiguration = updateData[0];
        const newAtMaxStatement = updateData[1];
        if (acceptableConfiguration) {
            newProposal[topic] = newVal;
            this.setState({
                speechProposal: newProposal,
                total: this.state.total + newVal - oldVal,
                result: this.countSupporters(),
                atMaxStatement: newAtMaxStatement,
            });
        } else {
            newProposal[topic] = oldVal;
        }
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
                for (const topic of Object.keys(this.state.speechProposal)) {
                    if (this.state.speechProposal[topic] < citizen['traits'][topic]) {
                        difference_score += (citizen['traits'][topic]
                            - this.state.speechProposal[topic]) ** 2;
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

    priorityPoint() {
        return this.state.atMaxStatement;
    }

    render() {
        const topics = this.props.topicNames.map((topic, key) => (
            <div key={key} className='speech-option'>
                <div className='speech-option_label'>
                    {topic}
                </div>
                <div className='speech-option_btns'>
                    {[...Array(3).keys()].map((score, j) => (
                        <input className='speech-radio' type='radio' name={topic} key={j}
                            id={'inlineRadio' + (2 * score + 1)} value={2 * score + 1}
                            checked={this.state.speechProposal[topic] === (2 * score + 1)}
                            onChange={(e) => this.handleButtonOnChange(e, topic)}/>
                        // </div>
                    ))}
                </div>
            </div>
        ));

        return (
            <div className="row w-100"><div className='col'>
                <div className='speech-context'>
                    <p className='speech-context_count'>
                        {this.generateStory()}
                    </p>
                    <div className='speech-context_points'>
                        {this.priorityPoint()}
                    </div>
                </div>
                <div className='speech-options'>
                    <div className='speech-option-desc'>
                        <span>Low priority</span>
                        <span>High priority</span>
                    </div>
                    {topics}
                </div>
                <div className='reset_button'>
                    <button
                        className='campaign-btn speech-btn'
                        onClick={this.props.submitPriorities}
                    >
                        Submit
                    </button>
                </div>
            </div></div>
        );
    }
}
Speech.propTypes = {
    population: PropTypes.object,
    countryName: PropTypes.string,
    updatePopulation: PropTypes.func,
    submitPriorities: PropTypes.func,
    speechProposal: PropTypes.object,
    topicNames: PropTypes.array,
    canReset: PropTypes.bool,
    round: PropTypes.number,
};

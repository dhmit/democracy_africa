import React from 'react';
import * as PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import PopoverTitle from 'react-bootstrap/PopoverTitle';
// eslint-disable-next-line no-unused-vars
import PopoverContent from 'react-bootstrap/PopoverContent';
import { project_features_and_create_svg_paths } from '../common';

import { MapPath } from '../UILibrary/components';
import './campaign.scss';

import IntroView from '../chooseAdventure/introView';

// NOTE(ra): this is a person icon path that I just bounced out of Illustrator and am hardcoding
// here for expediency. We should really put this in an SVG file and get it into the project
// in a more reasonable way!
// eslint-disable-next-line max-len
const PERSON_ICON_PATH = 'M0 458 c1 -59 84 -171 137 -184 l22 -6 -26 -34 c-51 -67 -40 -151 27\n' +
    '-208 38 -31 115 -36 160 -9 72 42 89 148 37 217 l-26 34 22 6 c26 6 93 69 112\n' +
    '105 7 14 17 43 23 64 l10 37 -249 0 -249 0 0 -22z';

const get_default_proposal = (topic_names) => {
    const proposal = {};
    topic_names.forEach((topic) => {
        proposal[topic] = 3;
    });
    return proposal;
};

// const all_topics = [
//     'Health services',
//     'Education',
//     'Water and sanitation',
//     'Roads and bridges',
//     'Electricity',
//     'Equal rights for women',
//     'Improving living standards for the poor',
//     'Creating jobs',
//     'Fighting corruption',
//     'Reducing violent community conflict',
// ];

const COUNTRIES = [
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
        max_priority_points: 12,
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
        supportThreshold: 2,
        max_priority_points: 22,
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
        supportThreshold: 12,
        max_priority_points: 35,
    },
];

function get_country_prop(country_name, prop_name) {
    // Each country has its own set of topicNames
    const country = COUNTRIES.filter((obj) => {
        return obj.name === country_name;
    })[0];
    return country[prop_name];
}


class Speech extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            speechProposal: this.props.speechProposal,
            result: 0,
            total: Object.keys(this.props.speechProposal).reduce((acc, topic) => {
                return acc + this.props.speechProposal[topic];
            }, 0),
        };
        this.difference_threshold = get_country_prop(this.props.countryName, 'supportThreshold');
        this.max_priority_points = get_country_prop(this.props.countryName, 'max_priority_points');
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
        if (this.state.total + newVal - oldVal <= this.max_priority_points) {
            newProposal[topic] = newVal;
            this.setState({
                speechProposal: newProposal,
                total: this.state.total + newVal - oldVal,
                result: this.countSupporters(),
            });
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
        if (this.max_priority_points - this.state.total > 0) {
            return 'You can prioritize more things.';
        }
        return 'You need to de-prioritize others first';
    }

    render() {
        const topics = this.props.topicNames.map((topic, key) => (
            <div key={key} className='speech-option'>
                <div className='speech-option_label'>
                    {topic}
                </div>
                <div className='speech-option_btns'>
                    {[...Array(5).keys()].map((score, j) => (
                        <input className='speech-radio' type='radio' name={topic} key={j}
                            id={'inlineRadio' + score + 1} value={score + 1}
                            checked={this.state.speechProposal[topic] === score + 1}
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


class Results extends React.Component {
    constructor(props) {
        super(props);
        this.map_height = 500;
        this.map_width = 500;
    }

    render() {
        const resultsData = this.props.provinceData;
        if (!resultsData) {
            return (<></>);
        }

        // TODO: possibly refactor this further since it is similar to CampaignView
        const sample = [];
        Object.values(this.props.provinceData).forEach((province) => {
            const citizens = province['citizens'];
            sample.push(...citizens.slice(0, Math.round(citizens.length * 0.25)));
        });
        const citizens = sample.map((citizen, k) => (
            <Citizen
                key={k}
                data={citizen}
                title={`Citizen of ${citizen['province']}`}
                generateDescription={this.props.generateDescription}
            />
        ));

        return (
            <div>
                <table border='1' className={'resultTable'}>
                    <tbody>
                        <tr>
                            <th>Province Name</th>
                            <th>Number of Supporters</th>
                            <th>Number of People</th>
                            <th>Percentage of Votes</th>
                        </tr>
                        {Object.keys(resultsData).map((province, k) => (
                            (
                                province !== 'countryTotal'
                                && province !== 'countrySupporters'
                                && province !== 'countryName'
                            )
                            && <tr key={k}>
                                <td>{province}</td>
                                <td>{resultsData[province].totalSupporters}</td>
                                <td>{resultsData[province].citizens.length}</td>
                                <td>{Math.round((resultsData[province].totalSupporters
                                    / resultsData[province].citizens.length) * 100)}%</td>
                            </tr>
                        ))}
                        <tr className={'countryResult'}>
                            <th>{this.props.countryName}</th>
                            <th>{this.props.countryData.totalSupport}</th>
                            <th>{this.props.countryData.totalPopulation}</th>
                            <th>{Math.round((this.props.countryData.totalSupport
                                                / this.props.countryData.totalPopulation) * 100)}%
                            </th>
                        </tr>
                    </tbody>
                </table>
                <div className='campaign-result_graphics'>
                    <svg
                        height={this.map_height}
                        width={this.map_width}
                        id='content'
                        className='result-map'
                    >
                        {this.props.mapData.map((province, i) => {
                            let countryFill;
                            if (province.name) {
                                countryFill = resultsData[province.name].totalSupporters
                                / resultsData[province.name].citizens.length > 0.5
                                    ? '#5abf5a' : '#db5653';
                            } else {
                                countryFill = '#F6F4D2';
                            }

                            return <MapPath
                                key={i}
                                path={province.svg_path}
                                id={province.postal}
                                fill={countryFill}
                                stroke='black'
                                strokeWidth='1'
                                useColorTransition={false}
                            />;
                        })}
                    </svg>
                    <div className='result-population'>
                        <div className='result-population_header'>
                            Results for sample population of size {sample.length}
                        </div>
                        <div className='result-population_svg'>
                            {citizens}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
Results.propTypes = {
    provinceData: PropTypes.object,
    countryData: PropTypes.object,
    countryName: PropTypes.string,
    mapData: PropTypes.array,
    generateDescription: PropTypes.func,
};

/**
 * Component for displaying citizen information
 *
 * The fill indicates the citizen's stance on the budget,
 * and hovering over the component displays the citizen's traits
 */
export class Citizen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    render() {
        const description = (
            <Popover id='popover-basic'>
                <Popover.Title>
                    {this.props.title}
                </Popover.Title>
                <Popover.Content>
                    {this.props.generateDescription(this.props.data)}
                </Popover.Content>
            </Popover>
        );
        return (
            <OverlayTrigger
                overlay={description}
                placement='right'
            >
                <svg
                    className='citizen'
                    height='20'
                    width='20'
                    viewBox="0 0 512 512"
                    fill={this.props.data.will_support ? '#5abf5a' : '#db5653'}
                >
                    <path d={PERSON_ICON_PATH} />
                </svg>
            </OverlayTrigger>
        );
    }
}
Citizen.propTypes = {
    data: PropTypes.object,
    title: PropTypes.string,
    generateDescription: PropTypes.func,
};

class CountrySelectorPopup extends React.Component {
    selectCountryClosePopup = (country) => {
        this.props.changeCountry(country);
        this.props.closePopup();
    };

    render() {
        return (
            <div className='country-selector'>
                <h3>Select a country</h3>
                <div className='row w-100'>
                    {COUNTRIES.map((country, key) => (
                        <div key={key} className='col-4'>
                            <div className='card' >
                                <div className='card-header'>
                                    <h5>{country.name}</h5>
                                </div>
                                <div className='card-body'>
                                    <table className='table'><tbody>
                                        <tr>
                                            <td>Population</td>
                                            <td>{country.population}</td>
                                        </tr>
                                        <tr>
                                            <td>Difficulty</td>
                                            <td>{country.difficulty}</td>
                                        </tr>
                                    </tbody></table>
                                </div>
                                <button
                                    onClick={() => this.selectCountryClosePopup(country.name)}
                                >Start</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
CountrySelectorPopup.propTypes = {
    changeCountry: PropTypes.func,
    closePopup: PropTypes.func,
};


export class CampaignView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            populationData: null,
            mapData: null,
            clickedProvince: null,
            countryName: null,
            view: 'intro',
            round: 0,
            speechProposal: null,
            topicNames: [],
            sampleSize: 75,
            showCountrySelector: false,
        };
        this.map_height = 500;
        this.map_width = 500;
        this.updatePopulation = this.updatePopulation.bind(this);
    }

    calculate_averages() {
        const population = this.state.populationData;
        console.log(this.state);
        Object.keys(population).forEach((province) => {
            Object.keys(population[province]['citizens']).forEach((citizen_name) => {
                // eslint-disable-next-line max-len
                const citizen = population[province]['citizens'][citizen_name];
                const topicNames = get_country_prop(this.state.countryName, 'topicNames');
                Object.keys(citizen['traits']).forEach((trait) => {
                    if (!topicNames.includes(trait)) { return; }
                    if (population[province]['averages'] === undefined) {
                        population[province]['averages'] = {
                            [trait]: citizen['traits'][trait],
                        };
                    } else if (population[province]['averages'][trait] === undefined) {
                        population[province]['averages'][trait] = citizen['traits'][trait];
                    } else {
                        population[province]['averages'][trait] += citizen['traits'][trait];
                    }
                });
            });
            Object.keys(population[province]['averages']).forEach((trait) => {
                const citizen_list = population[province]['citizens'];
                population[province]['averages'][trait] /= Object.keys(citizen_list).length;
            });
        });
        this.setState({
            populationData: population,
        });
    }

    determine_overlay_content(selected_province) {
        const high_value = [];
        const low_value = [];
        if (this.state.populationData[selected_province] === undefined) {
            return '';
        }
        const averages = this.state.populationData[selected_province]['averages'];
        console.log(averages);
        if (selected_province !== '' && selected_province !== null) {
            Object.keys(averages).forEach((trait) => {
                if (averages[trait] <= 2.5) {
                    low_value.push(trait);
                } else if (averages[trait] >= 3.5) {
                    high_value.push(trait);
                }
            });
            console.log(low_value);
            console.log(high_value);
            if (high_value.length === 0 && low_value.length === 0) {
                return 'Citizens of this province are equally concerned about all of the issues.';
            }
            if (high_value.length === 0) {
                let return_text_low = 'Citizens of this province have a low priority for ';
                for (let i = 0; i < low_value.length; i++) {
                    return_text_low += low_value[i];
                    if (low_value.length === 1) {
                        return_text_low += '.';
                    } else if (i === 0 && low_value.length === 2) {
                        return_text_low += ' and ';
                    } else if (i < low_value.length - 1 && low_value.length > 2) {
                        return_text_low += ', ';
                    } else {
                        return_text_low += '.';
                    }
                }
                return return_text_low;
            }
            if (low_value.length === 0) {
                let return_text_high = 'Citizens of this province have a high priority for ';
                for (let i = 0; i < high_value.length; i++) {
                    return_text_high += high_value[i];
                    if (high_value.length === 1) {
                        return_text_high += '.';
                    } else if (i === 0 && high_value.length === 2) {
                        return_text_high += ' and ';
                    } else if (i < high_value.length - 1 && high_value.length > 2) {
                        return_text_high += ', ';
                    } else {
                        return_text_high += '.';
                    }
                }
                return return_text_high;
            }
            let return_text_high = 'Citizens of this province have a high priority for ';
            for (let i = 0; i < high_value.length; i++) {
                return_text_high += high_value[i];
                if (high_value.length === 1) {
                    return_text_high += '.';
                } else if (i === 0 && high_value.length === 2) {
                    return_text_high += ' and ';
                } else if (i < high_value.length - 1 && high_value.length > 2) {
                    return_text_high += ', ';
                } else {
                    return_text_high += '.';
                }
            }

            let return_text_low = 'Citizens of this province have a low priority for ';
            for (let i = 0; i < low_value.length; i++) {
                return_text_low += low_value[i];
                if (low_value.length === 1) {
                    return_text_low += '.';
                } else if (i === 0 && low_value.length === 2) {
                    return_text_low += ' and ';
                } else if (i < low_value.length - 1 && low_value.length > 2) {
                    return_text_low += ', ';
                } else {
                    return_text_low += '.';
                }
            }
            return return_text_high + ' ' + return_text_low;
        }
        return '';
    }

    async fetchPopulation() {
        try {
            const data = {
                country_name: this.state.countryName,
            };
            const res = await fetch('/api/campaign_info/', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                },
            });

            const populationData = await res.json();
            // restructure population data
            const population = {};
            populationData.citizen_list.forEach((citizen) => {
                const province = citizen['province'];
                if (province in population) {
                    population[province]['citizens'].push(citizen);
                } else {
                    population[province] = {
                        'citizens': [citizen],
                        'totalSupporters': 0,
                    };
                }
            });
            console.log(population);

            const topicNames = get_country_prop(this.state.countryName, 'topicNames');

            this.setState({
                populationData: population,
                topicNames: topicNames,
                speechProposal: get_default_proposal(topicNames),
            }, () => {
                this.calculate_averages();
            });
        } catch (e) {
            console.log(e);
        }
    }

    async fetchCountryMap() {
        try {
            const map = await fetch('/api/state_map_geojson/'
                + get_country_prop(this.state.countryName, 'ISO') + '/',
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const geo_json = await map.json();
            const mapData = project_features_and_create_svg_paths(
                geo_json,
                this.map_width,
                this.map_height,
            );
            this.setState({
                mapData: mapData,
            });
        } catch (e) {
            console.log(e);
        }
    }

    updatePopulation(newPopulation) {
        this.setState({
            populationData: newPopulation,
        });
    }

    countTotalSupport() {
        let totalSupport = 0;
        let totalPopulation = 0;
        Object.values(this.state.populationData).forEach((province) => {
            totalSupport += province['totalSupporters'];
            totalPopulation += province['citizens'].length;
        });
        return { totalSupport: totalSupport, totalPopulation: totalPopulation };
    }

    handleProvinceMapClick(e, province) {
        const tagname = e.target.tagName;
        if (tagname === 'svg' || (tagname === 'path' && province)) {
            this.setState({
                clickedProvince: province,
                sampleSize: Math.min(this.state.populationData[province]['citizens'].length, 75),
            });
        }
    }

    changeCountry = (name) => {
        this.setState({
            countryName: name,
            clickedProvince: '',
            round: 0,
        },
        () => {
            this.fetchPopulation();
            this.fetchCountryMap();
        });
    };

    submitPriorities = () => {
        if (this.state.round < 3) {
            this.setState({
                round: this.state.round + 1,
                view: 'feedback',
            });
        } else {
            this.setState({ view: 'submitted' });
        }
    };

    generateDescription = (data) => {
        const traits = data['traits'];
        const topicNames = get_country_prop(this.state.countryName, 'topicNames');
        const pros = [];
        const cons = [];
        Object.keys(traits).forEach((trait) => {
            if (!topicNames.includes(trait)) { return; }
            if (traits[trait] > this.state.speechProposal[trait]) {
                cons.push(trait);
            } else {
                pros.push(trait);
            }
        });
        const desc = [];
        [pros, cons].forEach((issueList, i) => {
            let sentence = 'I am '
                + (issueList === cons ? 'not ' : '')
                + 'satisfied with the candidate\'s stance on ';
            issueList.forEach((issue, j) => {
                let trait = issue.toLowerCase();
                if (j === issueList.length - 1) {
                    trait += '.';
                } else if (j === issueList.length - 2) {
                    trait += ' and ';
                } else {
                    trait += ', ';
                }
                sentence += trait;
            });
            desc.push(<div key={i}>{sentence}</div>);
            desc.push(<br key={i}/>);
        });
        return desc;
    };

    render() {
        if (this.state.view === 'intro') {
            const description = <>
                <p>Welcome to the Campaign Game!</p>
                <p>In this game, you will create a political campaign and try to
                appeal to the most people in a country.</p>
                <p>You will have two rounds to set your campaign's priorities and gather
                survey data from citizens, and then one final chance to set your priorities
                and see how you do in an election.</p>
            </>;
            const altText = 'Nelson Mandela voting in the 1994 South African general election.';
            return (
                <>
                    {this.state.showCountrySelector
                        && <CountrySelectorPopup
                            changeCountry={this.changeCountry}
                            closePopup={() => this.setState(
                                { showCountrySelector: false, view: 'countryInfo' },
                            )}
                        />
                    }
                    <IntroView
                        desc={description}
                        setView={() => { this.setState({ showCountrySelector: true }); }}
                        imgFile={'mandela_voting_in_1994.jpg'}
                        altText={altText}
                        imgCaption={altText}
                    />
                </>
            );
        }



        if (!(this.state.populationData && this.state.mapData)) {
            return (<div>Loading!</div>);
        }
        const {
            clickedProvince,
            populationData,
            countryName,
        } = this.state;

        const aggregateResult = this.countTotalSupport();
        const overlay_title = clickedProvince === null || clickedProvince === '' ? 'No province'
            + ' selected' : clickedProvince;
        const overlay_content = this.determine_overlay_content(clickedProvince);

        const province_info_overlay = (
            <Popover id="popover-basic">
                <PopoverTitle as="h3">{overlay_title}</PopoverTitle>
                <PopoverContent>
                    {overlay_content}
                </PopoverContent>
            </Popover>
        );

        const map_svg = (
            <svg
                height={this.map_height}
                width={this.map_width}
                id='content'
                onClick={(e) => this.handleProvinceMapClick(e, '')}
            >
                {this.state.mapData.map((country, i) => {
                    let countryFill = '#F6F4D2';
                    let width = '1';
                    if (this.state.round > 0
                        && this.state.populationData[country.name]) {
                        const data = this.state.populationData[country.name];
                        /* eslint-disable-next-line max-len */
                        const supports = data['totalSupporters'] / data['citizens'].length > 0.5;
                        countryFill = supports ? '#B8E39B' : '#F19C79';
                    }

                    if (clickedProvince === country.name) {
                        width = '3';
                    }

                    return <MapPath
                        key={i}
                        path={country.svg_path}
                        id={country.postal}
                        fill={countryFill}
                        stroke='black'
                        strokeWidth={width}
                        handle_country_click={
                            (e) => this.handleProvinceMapClick(e, country.name)
                        }
                        useColorTransition={false}
                    />;
                })}
            </svg>
        );

        const campaign_map = (
            <div className='campaign-map'>
                {clickedProvince
                    ? <div className='province-info-text'>
                        <b>{clickedProvince}</b>
                    </div>
                    : <div className='province-info-text'>
                        <b>{countryName}</b>
                    </div>
                }
                {this.state.view === 'countryInfo'
                    ? <OverlayTrigger
                        trigger="hover"
                        placement="right"
                        overlay={province_info_overlay}
                    >{map_svg}
                    </OverlayTrigger>
                    : map_svg
                }
            </div>
        );

        if (this.state.view === 'countryInfo') {
            return (<div className="row">
                <div className='map-div col'>
                    {campaign_map}
                </div>
                <div className='col'>
                    <p>
                        Click on each province to learn what your initial polling has revealed
                        about the needs of its inhabitants.
                    </p>
                    <p>
                        You will be asked to prioritize the following issues:
                    </p>
                    <ul>
                        {this.state.topicNames.map((topic, i) => <li key={i}>{topic}</li>)}
                    </ul>

                    <button onClick={() => this.setState({ view: 'speechMaker', round: 1 })}>
                    I am ready to set my campaign's priorities!
                    </button>
                </div>
            </div>);
        }

        if (this.state.view === 'submitted') {
            return (
                <div>
                    <p className={'resultHeader'}>
                        Final Results for {countryName}
                    </p>
                    <Results
                        provinceData={populationData}
                        countryData={aggregateResult}
                        countryName={countryName}
                        mapData={this.state.mapData}
                        generateDescription={this.generateDescription}
                    />
                    <button
                        className='campaign-btn'
                        onClick={() => this.setState({ showCountrySelector: true })}
                    >
                        Try again or switch countries
                    </button>
                    {this.state.showCountrySelector
                        && <CountrySelectorPopup
                            changeCountry={this.changeCountry}
                            closePopup={() => this.setState(
                                { showCountrySelector: false, view: 'countryInfo' },
                            )}
                        />
                    }
                </div>
            );
        }

        if (this.state.view === 'feedback') {
            return (
                <div className={'campaign-container'}>
                    <Feedback
                        clickedProvince={clickedProvince}
                        round={this.state.round}
                        generateDescription={this.generateDescription}
                        results={populationData}
                        nextRound={() => this.setState({ view: 'speechMaker' })}
                    />
                    {campaign_map}
                </div>
            );
        }

        if (this.state.view === 'speechMaker') {
            return (
                <div className='speech-maker'>
                    <Speech
                        population={populationData}
                        countryName={countryName}
                        updatePopulation={this.updatePopulation}
                        submitPriorities={this.submitPriorities}
                        speechProposal={this.state.speechProposal}
                        topicNames={this.state.topicNames}
                        canReset={this.state.round === 1}
                        round={this.state.round}
                    />
                </div>
            );
        }

        // We should not get here...
        return (<></>);
    }
}

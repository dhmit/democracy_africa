import React from 'react';
import * as PropTypes from 'prop-types';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { project_features_and_create_svg_paths } from '../common';
import { MapPath } from '../UILibrary/components';
import './campaign.scss';

import IntroView from '../chooseAdventure/introView';

const THRESHOLDS = {
    'South Africa': 14,
    'Kenya': 7,
    'Botswana': 6,
};

const get_default_proposal = (topic_names) => {
    const proposal = {};
    topic_names.forEach((topic) => {
        proposal[topic] = 3;
    });
    return proposal;
};

const COUNTRIES = ['South Africa', 'Kenya', 'Botswana'];
const COUNTRY_TO_ISO = {
    'South Africa': 'ZAF',
    'Kenya': 'KEN',
    'Botswana': 'BWA',
};

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
        this.difference_threshold = THRESHOLDS[this.props.countryName];
        this.max_priority_points = 33;
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
            <>
                <div className='speech-context'>
                    <p className='speech-context_count'>
                        Currently on round {this.props.round} out of 3
                    </p>
                    <div className='speech-context_points'>
                        You have {this.max_priority_points - this.state.total} priority points left.
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
            </>
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
                : (<>Click on a province to view the responses</>)}
        </div>);

        return (
            <div className='feedback'>
                <div className='feedback-results'>
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
                >
                    <circle
                        cx='10'
                        cy='10'
                        r='10'
                        fill={this.props.data.will_support ? '#5abf5a' : '#db5653'}
                    />
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

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCountry: '',
        };
    }

    confirmCountry = () => {
        console.log('hi');
        this.props.changeCountry(this.state.selectedCountry);
        this.props.closePopup();
    }

    render() {
        return (
            <div className='country-selector'>
                <div className='country-selector_body'>
                    You will lose your progress when you switch countries
                    Country:&nbsp;
                    <select onChange={(e) => this.setState({ selectedCountry: e.target.value })}>
                        {COUNTRIES.map((country, key) => (
                            <option key={key}>
                                {country}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='country-selector_btns edx-sequence-nav'>
                    <button onClick={this.props.closePopup}>
                        Cancel
                    </button>
                    <button onClick={this.confirmCountry}>
                        Select
                    </button>
                </div>

            </div>
        );
    }
}
Popup.propTypes = {
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
            countryName: 'South Africa',
            view: 'intro',
            round: 1,
            speechProposal: null,
            topicNames: [],
            sampleSize: 75,
            showWarning: false,
        };
        this.map_height = 500;
        this.map_width = 500;
        this.updatePopulation = this.updatePopulation.bind(this);
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
            const topicNames = Object
                .keys(Object.values(population)[0]['citizens'][0]['traits']);
            this.setState({
                populationData: population,
                speechProposal: get_default_proposal(topicNames),
                topicNames: topicNames,
            });
        } catch (e) {
            console.log(e);
        }
    }


    async fetchCountryMap() {
        try {
            const map = await fetch('/api/state_map_geojson/'
                + COUNTRY_TO_ISO[this.state.countryName] + '/',
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

    /**
     * When this component is mounted to the DOM, get democracy score data from the server
     */
    async componentDidMount() {
        this.fetchPopulation();
        this.fetchCountryMap();
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
        const { populationData } = this.state;
        const topicNames = Object.keys(Object.values(populationData)[0]['citizens'][0]['traits']);
        this.setState({
            countryName: name,
            clickedProvince: '',
            round: 1,
            view: '',
            speechProposal: get_default_proposal(topicNames),
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
        const pros = [];
        const cons = [];
        Object.keys(traits).forEach((trait) => {
            if (traits[trait] > this.state.speechProposal[trait]) {
                cons.push(trait);
            } else {
                pros.push(trait);
            }
        });
        const desc = [];
        [pros, cons].forEach((issueList) => {
            const sentence = [<>
                I am {issueList === cons && 'not '}
                satisfied with the candidate&apos;s stance on&nbsp;
            </>];
            issueList.forEach((issue, i) => {
                let trait = issue.toLowerCase();
                if (i === issueList.length - 1) {
                    trait += '.';
                } else if (i === issueList.length - 2) {
                    trait += ' and ';
                } else {
                    trait += ', ';
                }
                sentence.push(<>{trait}</>);
            });
            desc.push(<div>{sentence}</div>);
            desc.push(<br/>);
        });
        return desc;
    };

    render() {
        if (!(this.state.populationData && this.state.mapData)) {
            return (<div>Loading!</div>);
        }

        if (this.state.view === 'intro') {
            const description = 'Welcome to the Campaign Game. The goal of this game is to'
                + ' create a campaign that will appeal to the most people in a country. You do'
                + ' this by allocating your priority points towards different services. If your'
                + ' priorities align with those of a given citizen, that citizen will support'
                + ' you. Citizens from different provinces will tend to favor some services more'
                + ' than others, so you can play with the assignments until you gain a majority of'
                + ' supporters.';
            const altText = 'Nelson Mandela voting in the 1994 South African general election.';
            return (
                <IntroView
                    desc={description}
                    setView={(view) => { this.setState({ view: view }); }}
                    imgFile={'/static/img/mandela_voting_in_1994.jpg'}
                    altText={altText}
                />
            );
        }

        const {
            clickedProvince,
            populationData,
            countryName,
        } = this.state;

        const aggregateResult = this.countTotalSupport();
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
                        onClick={() => {
                            this.changeCountry('South Africa');
                            this.setState({
                                view: 'stage',
                            });
                        }}
                    >
                        Go Back
                    </button>
                </div>
            );
        }

        return (
            <>
                <div className='campaign-header'>
                    <h1 className='campaign-title'>Campaign Game</h1>
                    <button
                        className='campaign-btn'
                        onClick={() => this.setState({ showWarning: true })}
                    >
                        Change country
                    </button>
                </div>
                {this.state.showWarning
                    && <Popup
                        changeCountry={this.changeCountry}
                        closePopup={() => this.setState({ showWarning: false })}/>}
                <div className={'campaign-container'}>
                    {this.state.view === 'feedback'
                        ? <Feedback
                            clickedProvince={clickedProvince}
                            round={this.state.round}
                            generateDescription={this.generateDescription}
                            results={populationData}
                            nextRound={() => this.setState({ view: '' })}
                        />
                        : <div className={'speech-maker'}>
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
                        </div>}
                    <div className={'map-div'}>
                        <div className={'campaign-map'}>
                            {clickedProvince
                                ? <div className={'province-info-text'}>
                                    <b>{clickedProvince}</b>
                                </div>
                                : <div className={'province-info-text'}>
                                    <b>{countryName}</b>
                                </div>
                            }
                            <svg
                                height={this.map_height}
                                width={this.map_width}
                                id='content'
                                onClick={(e) => this.handleProvinceMapClick(e, '')}
                            >
                                {this.state.mapData.map((country, i) => {
                                    const countryFill = '#F6F4D2';
                                    return <MapPath
                                        key={i}
                                        path={country.svg_path}
                                        id={country.postalintro}
                                        fill={countryFill}
                                        stroke='black'
                                        strokeWidth='1'
                                        handle_country_click={
                                            (e) => this.handleProvinceMapClick(e, country.name)
                                        }
                                        useColorTransition={false}
                                    />;
                                })}
                            </svg>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

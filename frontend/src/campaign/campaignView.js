import React from 'react';
import * as PropTypes from 'prop-types';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { project_features_and_create_svg_paths } from '../common';
import { MapPath } from '../UILibrary/components';
import './campaign.scss';

import IntroView from '../chooseAdventure/introView';


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
        this.topic_names = Object
            .keys(Object.values(this.props.population)[0]['citizens'][0]['traits']);
        this.state = {
            speechProposal: get_default_proposal(this.topic_names),
            result: 0,
            total: 30,
        };
        this.difference_threshold = 14;
        this.max_priority_points = 35;
    }

    /**
     * Resets the speech such that every topic has a value of 1.
     * Used when component mounts and upon onClick of a button
     */
    resetSpeech = () => {
        this.setState({
            speechProposal: get_default_proposal(this.topic_names),
            total: 30,
        }, () => {
            this.setState({ result: this.countSupporters() });
        });
    };

    componentDidMount() {
        // For a given list of options set each value to 1
        this.resetSpeech();
    }

    componentDidUpdate(prevProps) {
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
        const newProposal = this.state.speechProposal;
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
                    difference_score += Math.abs(citizen['traits'][topic]
                        - this.state.speechProposal[topic]);
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
        const topics = this.topic_names.map((topic, key) => (
            <div key={key} className='button-containers'>
                <p className='topics'>
                    <strong>{topic}</strong>
                </p>
                {[...Array(5).keys()].map((score, j) => (
                    <div className='form-check form-check-inline score-button' key={j}>
                        <input className='form-check-input' type='radio' name={topic}
                            id={'inlineRadio' + score + 1} value={score + 1}
                            checked={this.state.speechProposal[topic] === score + 1}
                            onChange={(e) => this.handleButtonOnChange(e, topic)}/>
                        <label
                            className='form-check-label'
                            htmlFor='inlineRadio1'
                        >{score + 1}
                        </label>
                    </div>
                ))}
            </div>
        ));

        return (
            <>
                <div className={'province-info-text'}>
                    You have {this.max_priority_points - this.state.total} priority points left.
                </div>
                <br/>
                <div>
                    {topics}
                </div>
                <div className='reset_button'>
                    <button
                        onClick={this.resetSpeech}
                    > Reset </button>
                    <button
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
};

export class Results extends React.Component {
    render() {
        const resultsData = this.props.provinceData;
        if (!resultsData) {
            return (<></>);
        }
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
            </div>
        );
    }
}
Results.propTypes = {
    provinceData: PropTypes.object,
    countryData: PropTypes.object,
    countryName: PropTypes.string,
};

class Citizen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    generateDescription = () => {
        const traits = this.props.data['traits'];
        return Object.keys(traits).map((trait) => (
            <>
                <strong> {trait} </strong>: &nbsp;
                {traits[trait]}
                <br/>
            </>
        ));
    };

    render() {
        const description = (
            <Popover id='popover-basic'>
                <Popover.Title>
                    Preferences for {this.props.data.name}
                </Popover.Title>
                <Popover.Content>
                    {this.generateDescription()}
                </Popover.Content>
            </Popover>
        );
        return (
            <OverlayTrigger
                overlay={description}
                placement='right'
            >
                <svg
                    className='budget-reaction-citizen'
                    height='20'
                    width='20'
                >
                    <circle
                        cx='10'
                        cy='10'
                        r='10'
                        fill={this.props.data.will_support ? 'green' : '#c0c0c0'}
                    />
                </svg>
            </OverlayTrigger>
        );
    }
}
Citizen.propTypes = {
    data: PropTypes.object,
};


export class CampaignView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            populationData: null,
            mapData: null,
            clickedProvince: null,
            countryName: 'South Africa',
            resultsData: null,
            view: 'intro',
            sampleSize: 50,
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

            this.setState({
                populationData: population,
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
                sampleSize: Math.min(this.state.populationData[province]['citizens'].length, 50),
            });
        }
    }

    changeCountry(e) {
        this.setState({ countryName: e.target.value, clickedProvince: '' },
            () => {
                this.fetchPopulation();
                this.fetchCountryMap();
            });
    }

    submitPriorities = () => {
        this.setState({ view: 'submitted' });
    };

    changeSampleSize = (e, inputMax) => {
        const newVal = e.target.value;
        if (newVal === '' || parseInt(newVal) < inputMax) {
            this.setState({
                sampleSize: e.target.value,
            });
        } else {
            this.setState({
                sampleSize: inputMax,
            });
        }
    };

    render() {
        if (!(this.state.populationData && this.state.mapData)) {
            return (<div>Loading!</div>);
        }
        const { clickedProvince, populationData, sampleSize } = this.state;
        const aggregateResult = this.countTotalSupport();

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
        if (this.state.view === 'submitted') {
            return (
                <div>
                    <p className={'resultHeader'}>
                        Final Results for {this.state.countryName}
                    </p>
                    <Results
                        provinceData={this.state.populationData}
                        countryData={aggregateResult}
                        countryName={this.state.countryName}
                    />
                    <button onClick={() => { this.setState({ view: 'stage' }); } }>
                        Go Back
                    </button>
                </div>
            );
        }

        let citizenReactions;
        if (populationData && clickedProvince) {
            const citizens = populationData[clickedProvince]['citizens'];
            const sample = citizens.slice(0, sampleSize);
            citizenReactions = sample.map((citizen, k) => (
                <Citizen key={k} data={citizen}/>
            ));
        }

        // TODO: refactor citizen reaction into a separate component
        let viewSample = (<p>Click on a province to view individual results</p>);
        if (clickedProvince) {
            const citizens = populationData[clickedProvince]['citizens'];
            viewSample = (
                <div>
                    Sample Size:
                    <input
                        type="number"
                        name="sampleSize"
                        step="1"
                        min="0"
                        max={citizens.length}
                        value={sampleSize}
                        onChange={(e) => this.changeSampleSize(e, citizens.length)}
                    />
                </div>
            );
        }

        return (
            <>
                <h1>Campaign Game</h1><hr/>
                <div className='country-selector'>
                    Select a Country:&nbsp;
                    <select onChange={(e) => this.changeCountry(e)}>
                        {COUNTRIES.map((country, key) => (
                            <option key={key}>
                                {country}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={'campaign-container'}>
                    <div className={'speech-maker'}>
                        <Speech
                            population={this.state.populationData}
                            countryName={this.state.countryName}
                            updatePopulation={this.updatePopulation}
                            submitPriorities={this.submitPriorities}
                        />
                    </div>
                    <div className={'map-div'}>
                        <div className={'campaign-map'}>
                            {this.state.clickedProvince
                                ? <div className={'province-info-text'}>
                                    <b>{this.state.clickedProvince}</b>
                                    <br/>
                                    {populationData[clickedProvince]['totalSupporters']}
                                    &nbsp;out of&nbsp;
                                    {populationData[clickedProvince]['citizens'].length}
                                    &nbsp;people support you.
                                </div>
                                : <div className={'province-info-text'}>
                                    <b>{this.state.countryName}</b>
                                    <br/>
                                    {aggregateResult['totalSupport']}
                                    &nbsp;out of&nbsp;
                                    {aggregateResult['totalPopulation']}
                                    &nbsp;people support you.
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
                                        id={country.postal}
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
                            <div>
                                {viewSample}
                                {citizenReactions}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

import React from 'react';

// eslint-disable-next-line no-unused-vars
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import PopoverTitle from 'react-bootstrap/PopoverTitle';
// eslint-disable-next-line no-unused-vars
import PopoverContent from 'react-bootstrap/PopoverContent';

import { MapPath } from '../UILibrary/components';

import { Speech, get_country_prop, get_default_proposal } from './speech';
import Feedback from './feedback';
import Results from './results';
import CountrySelectorPopup from './countrySelectorPopup';
import IntroView from '../chooseAdventure/introView';
import Navbar from '../about/Navbar';

import { project_features_and_create_svg_paths } from '../common';

import Citizen from './citizen';

const generateOverlayText = (services, priorityType) => {
    let newText = ' ';
    for (let i = 0; i < services.length; i++) {
        newText += services[i];
        priorityType = priorityType.toUpperCase();
        if (services.length === 1) {
            newText += '.';
        } else if (i === services.length - 2) {
            newText += ' and ';
        } else if (i < services.length - 1 && services.length > 2) {
            newText += ', ';
        } else {
            newText += '.';
        }
    }
    return (
        <p className='popover-text'>
            Citizens of this province have a <strong>{priorityType}</strong> priority for
            {newText}
        </p>
    );
};

const roundAggregateData = { };

export class CampaignView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clickedProvince: null,
            countryName: null,
            mapData: null,
            populationData: null,
            round: 0,
            sampleSize: 75,
            showCountrySelector: false,
            speechProposal: null,
            view: 'intro',
            topicNames: [],
        };
    }

    componentDidUpdate() {
        if (this.state.showCountrySelector) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    changeView = (newState) => {
        this.setState({
            ...newState,
            clickedProvince: '',
        }, () => { window.scrollTo(0, 0); });
    };

    calculate_averages() {
        const population = this.state.populationData;
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

    generateProvincePopoverStatement(value, type) {
        let statement = 'Citizens of this province have a ' + type + ' priority for ';
        for (let i = 0; i < value.length; i++) {
            statement += value[i];
            if (value.length === 1) {
                statement += '.';
            } else if (i === 0 && value.length === 2) {
                statement += ' and ';
            } else if (i < value.length - 1 && value.length > 2) {
                statement += ', ';
            } else {
                statement += '.';
            }
        }
        return statement;
    }

    determine_overlay_content(selected_province) {
        const high_value = [];
        const low_value = [];
        if (this.state.populationData[selected_province] === undefined) {
            return '';
        }
        const averages = this.state.populationData[selected_province]['averages'];
        if (selected_province !== '' && selected_province !== null) {
            Object.keys(averages).forEach((trait) => {
                if (averages[trait] <= 2.5) {
                    low_value.push(trait);
                } else if (averages[trait] >= 3.5) {
                    high_value.push(trait);
                }
            });
            if (high_value.length === 0 && low_value.length === 0) {
                return 'Citizens of this province are equally concerned about all of the issues.';
            }
            let high_text;
            if (high_value.length !== 0) {
                high_text = generateOverlayText(
                    high_value,
                    'high',
                );
            }

            let low_text;
            if (low_value.length !== 0) {
                low_text = generateOverlayText(
                    low_value,
                    'low',
                );
            }

            if (!high_text) {
                return low_text;
            }

            return low_text
                ? (<div>{high_text}<br></br>{low_text}</div>)
                : high_text;
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

    updatePopulation = (newPopulation) => {
        this.setState({
            populationData: newPopulation,
        });
    };

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
        const tagName = e.target.tagName;
        if (tagName === 'svg' || (tagName === 'path' && province)) {
            this.setState({
                clickedProvince: province,
                sampleSize: province
                    ? Math.min(this.state.populationData[province]['citizens'].length, 75)
                    : 0,
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
            this.changeView({
                round: this.state.round + 1,
                view: 'feedback',
            });
        } else {
            this.changeView({ view: 'submitted' });
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
        // This is for when the citizen is completely one sided about all issues
        if (pros.length === 0) {
            desc.push(<div key={1}>
                I am dissatisfied with the candidate's stance on everything.
            </div>);
            return desc;
        }
        if (cons.length === 0) {
            desc.push(<div key={1}>
                I am completely satisfied with the candidate's stance on everything.
            </div>);
            return desc;
        }
        const proSentence = 'I am satisfied with the candidate\'s stance on ';
        const conSentence = 'I believe that the candidate does not give enough priority to ';
        [pros, cons].forEach((issueList, i) => {
            let sentence = issueList === cons ? conSentence : proSentence;
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

    startGame = () => {
        this.setState({
            view: 'speechMaker',
            round: 1,
            clickedProvince: '',
        });
    };

    render() {
        if (this.state.view === 'intro') {
            const altText = 'Nelson Mandela voting in the 1994 South African general election.';
            const campaignIntroDesc = {
                desc: (<>
                    <h1>Welcome to the Campaign Game!</h1>
                    <p>In this game, you will create a political campaign and try to
                    appeal to the most people in a country.</p>
                    <p>You will have two rounds to set your campaign's priorities and gather
                    survey data from citizens, and then one final chance to set your priorities
                    and see how you do in an election.</p>
                </>),
                img: {
                    imgFilename: 'mandela_voting_in_1994.jpg',
                    imgAlt: altText,
                    imgCaption: (<>{altText}</>),
                },
            };
            return (
                <>
                    <Navbar currentPage='campaign'/>
                    {this.state.showCountrySelector
                        && <CountrySelectorPopup
                            changeCountry={this.changeCountry}
                            closePopup={(startGame) => {
                                if (startGame) {
                                    this.changeView({
                                        showCountrySelector: false,
                                        view: 'countryInfo',
                                    });
                                } else {
                                    this.setState(
                                        { showCountrySelector: false },
                                    );
                                }
                            }}
                        />
                    }
                    <IntroView
                        setView={() => { this.setState({ showCountrySelector: true }); }}
                        introDescriptions={campaignIntroDesc}
                        buttonStyle='campaign-btn'
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
        roundAggregateData[this.state.round] = aggregateResult;
        const overlay_title = clickedProvince === null || clickedProvince === '' ? 'Click on'
            + ' a province' : clickedProvince;

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
                viewBox="-20 -20 875 875"
                id='content'
                onClick={(e) => this.handleProvinceMapClick(e, '')}
            >
                {this.state.mapData.map((country, i) => {
                    let countryFill = '#F6F4D2';
                    let width = '1';
                    if (this.state.round > 0
                        && this.state.populationData[country.name]
                        && this.state.view !== 'speechMaker') {
                        const data = this.state.populationData[country.name];
                        const supports = data['totalSupporters'] / data['citizens'].length >= 0.5;
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

        let provinceDesc;
        if (['speechMaker', 'feedback'].includes(this.state.view)) {
            provinceDesc = '';
        } else if (clickedProvince) {
            provinceDesc = clickedProvince;
        } else {
            provinceDesc = countryName;
        }
        const windowHeight = document.documentElement.clientHeight;
        const windowWidth = document.documentElement.clientWidth;
        let provinceDisplayInfo = <p>{''}</p>;
        if ((windowHeight < 500 || windowWidth < 500) && this.state.view === 'countryInfo') {
            provinceDisplayInfo = overlay_content;
        }
        const campaign_map = (
            <div className='campaign-map'>
                <b>{ provinceDesc }</b>
                <div className='province-popover-info'>
                    {provinceDisplayInfo}
                </div>
                {(['countryInfo', 'feedback', 'speechMaker'].includes(this.state.view)
                    && (windowHeight >= 500 && windowWidth >= 500))
                    ? <OverlayTrigger
                        trigger="hover"
                        placement='top-end'
                        overlay={province_info_overlay}
                    >{map_svg}
                    </OverlayTrigger>
                    : map_svg
                }
            </div>
        );

        if (this.state.view === 'countryInfo') {
            const infoInstructions = (
                <>
                    <p>
                        Your campaign team has compiled some research they did on the needs of the
                        inhabitants of each province.
                    </p>
                    <p>
                        Click on each province to see what your team
                        has found out about what issues the citizens prefer to have more priority.
                    </p>
                </>
            );

            return (<div className="row">
                <Navbar currentPage='campaign'/>
                <div className='col-sm-12 col-md-7 d-md-none'>
                    <div className="d-block d-md-none">
                        {infoInstructions}
                    </div>
                    {campaign_map}
                </div>
                <div className='col-sm-12 col-md-5'>
                    <div className="d-none d-md-block">
                        {infoInstructions}
                    </div>
                    <p>
                        You will be asked to prioritize the following issues:
                    </p>
                    <ul style={{ marginBottom: '30px' }}>
                        {this.state.topicNames.map((topic, i) => <li key={i}>{topic}</li>)}
                    </ul>
                    <button
                        className='campaign-btn d-none d-md-block'
                        onClick={this.startGame}
                        style={{ textAlign: 'center' }}
                    >
                        I am ready to set my campaign's priorities!
                    </button>
                    <button
                        className='campaign-btn d-block d-md-none w-100'
                        onClick={this.startGame}
                    >
                        <div style={{ textAlign: 'center' }}>
                            I am ready to set my campaign's priorities!
                        </div>
                    </button>
                </div>
                <div className='col-sm-12 col-md-7 d-none d-md-block'>
                    <p className="d-block d-md-none">
                        {infoInstructions}
                    </p>
                    {campaign_map}
                </div>
            </div>);
        }

        let sample = [];
        let citizenReactions = '';
        if (this.state.view === 'submitted' && clickedProvince === '') {
            sample = Object.keys(populationData).reduce((acc, province) => {
                return acc.concat(populationData[province].citizens.slice(0, 10));
            }, []);
        } else if (clickedProvince) {
            sample = populationData[clickedProvince]['citizens'].slice(0, 100);
        }
        citizenReactions = sample.map((citizen, k) => (
            <Citizen
                key={k}
                data={citizen}
                title={`Citizen of ${citizen['province']}`}
                generateDescription={this.generateDescription}
            />
        ));

        const feedbackTable = (<div className='feedback-pop'>
            <table border="1" className={'resultTable'}>
                <tbody>
                    <tr>
                        <th>Service</th>
                        <th>Percentage of Sample Satisfied</th>
                    </tr>
                    {this.state.topicNames.map((topic, k) => {
                        const numSatisfied = sample.reduce((acc, citizen) => {
                            if (citizen.traits[topic]
                                <= this.state.speechProposal[topic]) {
                                return acc + 1;
                            }
                            return acc;
                        }, 0);
                        const pctSatisfied = Math.round((numSatisfied
                            / sample.length) * 100);
                        return (
                            <tr key={k}>
                                <td>{topic}</td>
                                <td>{pctSatisfied}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>);

        if (this.state.view === 'submitted') {
            return (
                <div>
                    <Navbar currentPage='campaign'/>
                    <Results
                        provinceData={populationData}
                        countryData={aggregateResult}
                        countryName={countryName}
                        mapData={this.state.mapData}
                        generateDescription={this.generateDescription}
                        map={campaign_map}
                        clickedProvince={this.state.clickedProvince}
                        feedbackTable={feedbackTable}
                        citizenReactions={citizenReactions}
                    />
                    <div className="retry-button d-none d-lg-flex">
                        <button
                            className='campaign-btn'
                            onClick={() => this.setState({ showCountrySelector: true })}
                        >
                            Try again or switch countries
                        </button>
                    </div>
                    <div className="retry-button d-flex d-lg-none">
                        <button
                            className='campaign-btn w-100'
                            onClick={() => this.setState({ showCountrySelector: true })}
                        >
                            Try again or switch countries
                        </button>
                    </div>
                    {this.state.showCountrySelector
                        && <CountrySelectorPopup
                            changeCountry={this.changeCountry}
                            closePopup={(startGame) => {
                                if (startGame) {
                                    this.changeView(
                                        { showCountrySelector: false, view: 'countryInfo' },
                                    );
                                } else {
                                    this.setState(
                                        { showCountrySelector: false },
                                    );
                                }
                            }}
                        />
                    }
                </div>
            );
        }

        if (this.state.view === 'feedback') {
            return (
                <div>
                    <Navbar currentPage='campaign'/>
                    <Feedback
                        clickedProvince={clickedProvince}
                        round={this.state.round}
                        generateDescription={this.generateDescription}
                        nextRound={() => this.changeView({ view: 'speechMaker' })}
                        topicNames={this.state.topicNames}
                        speechProposal={this.state.speechProposal}
                        campaignMap={campaign_map}
                        feedbackTable={feedbackTable}
                        citizenReactions={citizenReactions}
                    />
                </div>
            );
        }

        if (this.state.view === 'speechMaker') {
            return (
                <div className='speech-maker'>
                    <Navbar currentPage='campaign'/>
                    <Speech
                        population={populationData}
                        countryName={countryName}
                        updatePopulation={this.updatePopulation}
                        submitPriorities={this.submitPriorities}
                        rawSpeechProposal={this.state.speechProposal}
                        topicNames={this.state.topicNames}
                        canReset={this.state.round === 1}
                        round={this.state.round}
                        campaign_map={campaign_map}
                        roundAggregateData={roundAggregateData}
                    />
                </div>
            );
        }

        // We should not get here...
        return (<></>);
    }
}

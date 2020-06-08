import React from 'react';

// eslint-disable-next-line no-unused-vars
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import PopoverTitle from 'react-bootstrap/PopoverTitle';
// eslint-disable-next-line no-unused-vars
import PopoverContent from 'react-bootstrap/PopoverContent';
import { project_features_and_create_svg_paths } from '../common';

import { MapPath } from '../UILibrary/components';
import './campaign.scss';

import { Speech, get_country_prop, get_default_proposal } from './speech';
import Feedback from './feedback';
import Results from './results';
import CountrySelectorPopup from './countrySelectorPopup';
import IntroView from '../chooseAdventure/introView';

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
            const caption = (<>{altText}</>);
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
                        imgCaption={caption}
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

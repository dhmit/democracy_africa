import React from 'react';
import * as PropTypes from 'prop-types';
import * as d3 from 'd3';
import { MapPath } from '../UILibrary/components';
import {
    getCookie,
    project_features_and_create_svg_paths,
} from '../common';
import Navbar from '../about/Navbar';
/**
 * Main component for the map quiz.
 *
 * Handles all logic, displays information, and makes database query/posts
 */


export class DemocracyViz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            democracyData: null,
            scoreType: 'v2x_polyarchy',
            year: '1981',
        };
        this.interval = null;
    }

    /**
     * When this component is mounted to the DOM, get democracy score data from the server
     */
    async componentDidMount() {
        try {
            const res = await fetch('/api/democracy_scores/');
            const democracy_data = await res.json();
            this.setState({
                democracyData: JSON.parse(democracy_data),
            });
        } catch (e) {
            console.log(e);
        }
    }

    /**
     *  Handles the change in democracy score type
     */
    handleScoreTypeChange(e) {
        this.setState({
            scoreType: e.target.value,
        });
    }

    /**
     *  Handles the change in year
     */
    handleYearChange(e) {
        clearInterval(this.interval);
        this.interval = null;
        this.setState({
            year: e.target.value,
        });
    }

    /**
     * Sets the year to 1981 and goes through every year until 2018
     */
    cycleThroughYears() {
        this.setState({year: '1981'});
        if (this.interval === null) {
            this.interval = setInterval(() => {
                const nextYear = (parseInt(this.state.year) + 1) + '';
                if (nextYear === '2018') {
                    clearInterval(this.interval);
                    this.interval = null;
                }
                this.setState({year: nextYear});
            }, 300);
        }
    }

    render() {
        if (!this.state.democracyData) {
            return (<div>Loading!</div>);
        }
        return (
            <>
                <Navbar/>
                <h1>Democracy in Africa Over Time</h1><hr/>
                Democracy Score Type: &nbsp;
                <select onChange={(e) => this.handleScoreTypeChange(e)}>
                    <option>
                        v2x_polyarchy
                    </option>
                </select>
                <br/><br/>
                <div className = 'slidecontainer'>
                    <div>
                        <input onChange={(e) => this.handleYearChange(e)}
                            type='range' id = 'year' name = 'year' min = '1981' max = '2018'
                            step = '1' className= 'slider' value={this.state.year}>
                        </input>
                    </div>
                    {this.state.year}
                </div>

                <br/>
                <button onClick={() => this.cycleThroughYears()}>
                    Play
                </button>
                <br/>
                Currently grey either means:
                <ul>
                    {/* Remove this later once we fix data */}
                    <li>Country doesn&apos;t exist in CSV</li>
                    {/* Maybe keep this bottom one */}
                    <li>
                        The country does exist but there is no data for that particular
                        score type in that particular year
                    </li>
                </ul>
                <br/>
                <div className={'map'}>
                    <DemocracyMap
                        democracyData={this.state.democracyData}
                        scoreType={this.state.scoreType}
                        year={this.state.year}

                    />

                </div>

                <svg className={'svgrect'}>
                    <rect className={'gradient'} />

                </svg>
                <div className={'low-label'}>
                    Lowest score
                </div>


            </>
        );
    }
}


export class DemocracyMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map_data: null,
            // mouseover_country: 'Nothing',
        };
        this.map_height = 1000;
        this.map_width = 1000;
        this.csrftoken = getCookie('csrftoken');
        // this.map_ref = React.createRef();
        this.getCountryData = this.getCountryData.bind(this);
    }

    /**
     * When this component is mounted to the DOM, get GeoJSON data from the server
     */
    async componentDidMount() {
        try {
            const res = await fetch('/api/africa_map_geojson/');
            const geo_json = await res.json();
            const map_data = project_features_and_create_svg_paths(geo_json, this.map_width,
                this.map_height);
            this.setState({
                map_data: map_data,
            });
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Gets the country data from the democracy data based on the countryCode
     * @param countryCode the ISO code of the country
     * @returns the country data associated with the country ISO code
     */
    getCountryData(countryCode) {
        for (const countryData of this.props.democracyData) {
            if (countryCode === countryData['country_text_id']) {
                return countryData;
            }
        }
        throw new Error(`ISO code ${countryCode} is not in our list of ISO codes`);
    }

    render() {
        if (!this.state.map_data) {
            return (<div>Loading!</div>);
        }
        const colorScale = d3.scaleLinear()
            .domain([0, 1])
            .range(['yellow', 'red']);
        return (
            <>
                <svg
                    height='1000'
                    width='1000'
                    id='content'
                >
                    {this.state.map_data.map((country, i) => {
                        const countryData = this.getCountryData(country.iso);
                        // Using ternary because some country data doesn't exist
                        const countryScores = countryData
                            ? countryData['democracy_scores'][this.props.year]
                            : null;
                        const countryScore = countryScores
                            ? countryScores[this.props.scoreType]
                            : '';
                        const color = countryScore !== ''
                            ? colorScale(countryScore)
                            : 'grey';
                        return (
                            <MapPath
                                key={i}
                                path={country.svg_path}
                                id={country.iso}
                                fill={color}
                                stroke={'black'}
                                strokeWidth={'1'}
                                useColorTransition={true}
                            />
                        );
                    })}
                </svg>
            </>
        );
    }
}
DemocracyMap.propTypes = {
    democracyData: PropTypes.array,
    scoreType: PropTypes.string,
    year: PropTypes.string,
};


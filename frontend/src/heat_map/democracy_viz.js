import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

import { getCookie } from '../common'
import '../map_quiz/map_quiz.css';

/**
 * Main component for the map quiz.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

export class DemocracyViz extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            democracyData: null,
            scoreType: "v2x_polyarchy",
            year: "1981",
        };
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

    handleScoreTypeChange (e) {
        this.setState({
            scoreType: e.target.value,
        })
    }

    handleYearChange (e) {
        this.setState({
            year: e.target.value,
        })
    }

    render() {
        if (!this.state.democracyData) {
            return (<div>Loading!</div>);
        }
        return (
            <>
                <h1>Democracy in Africa Over Time</h1><hr/>
                Democracy Score Type: &nbsp;
                <select onChange={(e) => this.handleScoreTypeChange(e)}>
                    {Object.keys(this.state.democracyData[0]["democracy_scores"]["1981"]).map(
                        (entry, i) => (
                            <option key={i}>
                                {entry}
                            </option>
                        )
                    )}
                </select>
                <br/>
                Year: &nbsp;
                <select onChange={(e) => this.handleYearChange(e)}>
                    {Object.keys(this.state.democracyData[0]["democracy_scores"]).map(
                        (entry, i) => (
                            <option key={i}>
                                {entry}
                            </option>
                        )
                    )}
                </select>
                <br/>
                Currently grey either means:
                <ul>
                    {/*Remove this later once we fix data*/}
                    <li>Country doesn&apos;t exist in CSV</li>
                    {/*Maybe keep this bottom one*/}
                    <li>
                        The country does exist but there is no data for that particular
                        score type in that particular year
                    </li>
                </ul>
                <br/>
                <DemocracyMap
                    democracyData={this.state.democracyData}
                    scoreType={this.state.scoreType}
                    year={this.state.year}
                />
            </>
        )
    }
}

const scoreTypeRanges = {
    "v2x_polyarchy": {
        "min": 0,
        "max": 1
    },
    "v2x_partipdem": {
        "min": 0,
        "max": 1
    },
    "v2x_freexp_altinf": { //ordinal
        "min": 0,
        "max": 1
    },
    "v2x_cspart": {
        "min": 0,
        "max": 1
    },
    "v2xel_locelec": {
        "min": 0,
        "max": 1
    },
    "v2elboycot": {
        // what does ordinal values mean and how to convert it to
        // what is in the database
        "min": 0,
        "max": 1
    },
    "v2lpname": { // this is a text value???
        "min": 0,
        "max": 1
    },
    "v2slpname": { // text value
        "min": 0,
        "max": 1
    },
    "v2tlpname": { //text value
        "min": 0,
        "max": 1
    },
    "v2psnatpar": { //ordinal
        "min": 0,
        "max": 1
    },
    "v2excrptps": { //ordinal
        "min": 0,
        "max": 1
    },
    "v2juaccnt": { //ordinal
        "min": 0,
        "max": 1
    },
    "v2svstterr": { //percentage
        "min": 0,
        "max": 100
    },
    "v2meharjrn": { //ordinal
        "min": 0,
        "max": 1
    },
    "v2peprisch": { //percentage
        "min": 0,
        "max": 100
    },
    "v2pesecsch": {
        "min": 0,
        "max": 100
    },
    "v2smonex": { //ordinal
        "min": 0,
        "max": 1
    },
    "e_migdppc": { //GDP so it can be anything
        "min": 0,
        "max": 60000
    },
    "e_mipopula": { //population
        "min": 0,
        "max": 100000
    },
    "gdpcapl": { //not in guidebook
        "min": 0,
        "max": 60000
    },
    "ethfrac": { //not in guidebook
        "min": 0,
        "max": 1
    },
    "relfrac": { //not in guidebook
        "min": 0,
        "max": 1
    },
    "numlang": { //not in guidebook
        "min": 0,
        "max": 1
    },
    "colbrit": { //not in guidebook
        "min": 0,
        "max": 1
    },
    "colfra": { //not in guidebook
        "min": 0,
        "max": 1
    },
    "gdpcap_currusd": { //not in guidebook
        "min": 0,
        "max": 1
    },
    "adultliteracy": { //not in guidebook
        "min": 0,
        "max": 1
    },
    "elecaccessrur": { //not in guidebook
        "min": 0,
        "max": 1
    },
};

export class DemocracyMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: 29,
            lat: -22,
            zoom: 4,
            map_data: null,
            mouseover_country: 'Nothing',
        };
        this.csrftoken = getCookie('csrftoken');
        this.map_ref = React.createRef();
        this.getCountryData = this.getCountryData.bind(this);
    }

    /**
     * When this component is mounted to the DOM, get GeoJSON data from the server
     */
    async componentDidMount() {
        try {
            const res = await fetch('/api/africa_map_geojson/');
            const geo_json = await res.json();
            const map_data = this.project_features_and_create_svg_paths(geo_json);
            this.setState({
                map_data: map_data,
            });
        } catch (e) {
            console.log(e);
        }
    }

    project_features_and_create_svg_paths(geo_json) {
        const scale = 500;
        const projection = d3.geoMercator()
            .center([5, 15])
            .scale(scale)
            .translate([scale/2, scale/2]);

        const geoGenerator = d3.geoPath().projection(projection);

        const map_data = [];
        for (const feature of geo_json.features) {
            const svg_path = geoGenerator(feature.geometry);
            const name = feature.properties.name;
            const postal = feature.properties.postal;
            const iso = feature.properties.iso_a3; // Not sure if this is the correct ISO code
            map_data.push({svg_path, name, postal, iso});
        }
        return map_data;
    }

    // handle_country_mouseover(country) {
    //     this.setState({
    //         mouseover_country: country.name,
    //     })
    // }

    getCountryData(countryCode) {
        for (const countryData of this.props.democracyData) {
            if (countryCode === countryData["country_text_id"]) {
                return countryData;
            }
        }
    }

    render() {
        if (!this.state.map_data) {
            return (<div>Loading!</div>);
        }
        const colorScale = d3.scaleLinear()
            .domain([scoreTypeRanges[this.props.scoreType]["min"],
                scoreTypeRanges[this.props.scoreType]["max"]])
            .range(['red', 'blue']);
        return (
            <>
                {/*<div>{this.state.mouseover_country}</div>*/}

                <svg
                    height="1000"
                    width="1000"
                    id="content"
                >
                    {this.state.map_data.map((country, i) => {
                        const countryData = this.getCountryData(country.iso);
                        // Using ternary because some country data doesn't exist
                        const countryScores = countryData
                            ? countryData["democracy_scores"][this.props.year]
                            : null;
                        const countryScore = countryScores
                            ? countryScores[this.props.scoreType]
                            : "";
                        const color = countryScore !== ""
                            ? colorScale(countryScore)
                            : "grey";
                        return (
                            <MapPath
                                key={i}
                                path={country.svg_path}
                                id={country.postal}
                                fill={color}
                            />
                        )
                    })}
                </svg>
            </>
        )
    }
}
DemocracyMap.propTypes = {
    democracyData: PropTypes.array,
    scoreType: PropTypes.string,
    year: PropTypes.string,
};

export class MapPath extends React.Component {
    render() {
        return (
            <path
                d={this.props.path}
                stroke="black"
                strokeWidth="1"
                fill={this.props.fill}
                id={this.props.id}
                // onMouseOver={this.props.handle_country_mouseover}
            />
        );
    }
}
MapPath.propTypes = {
    path: PropTypes.string,
    id: PropTypes.string,
    fill: PropTypes.string,
    // handle_country_mouseover: PropTypes.func,
};

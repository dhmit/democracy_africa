import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

import { MapPath } from "../MapPath";

import { getCookie, project_features_and_create_svg_paths } from '../common'
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

    handleScoreTypeChange(e) {
        this.setState({
            scoreType: e.target.value,
        })
    }

    handleYearChange(e) {
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

export class DemocracyMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map_data: null,
            // mouseover_country: 'Nothing',
        };
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
            const map_data = project_features_and_create_svg_paths(geo_json);
            this.setState({
                map_data: map_data,
            });
        } catch (e) {
            console.log(e);
        }
    }

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
            .domain([0, 1])
            .range(['white', 'blue']);
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
                                stroke={"black"}
                                strokeWidth={"1"}
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


import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

import { MapPath } from "../MapPath";

import { getCookie, project_features_and_create_svg_paths } from '../common';
import './heat_map.css';

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
        this.setState({
            year: e.target.value,
        });
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
                    <option>
                        v2x_polyarchy
                    </option>
                </select>
                <br/><br/>
                <div className = 'slidecontainer'>
                    <div className={'map'}>
                        <input onChange={(e) => this.handleYearChange(e)}
                            type='range' id = 'year' name = 'year' min = '1981' max = '2018'
                            step = '1' className= 'slider'>
                        </input>
                    </div>
                    {this.state.year}
                </div>

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
                <div className={'map'}>
                    <DemocracyMap
                        democracyData={this.state.democracyData}
                        scoreType={this.state.scoreType}
                        year={this.state.year}

                    />
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
        this.csrftoken = getCookie('csrftoken');
        this.map_ref = React.createRef();
        this.getCountryData = this.getCountryData.bind(this);
        this.hoverInfo = this.hoverInfo.bind(this);
        this.removeInfo = this.removeInfo.bind(this);
    }

    /**
     * When this component is mounted to the DOM, get GeoJSON data from the server
     */
    async componentDidMount() {
        try {
            const res = await fetch('/api/africa_map_geojson/');
            const geo_json = await res.json();
            const map_data = project_features_and_create_svg_paths(geo_json, [5, 15]);
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
            if (countryCode === countryData["country_text_id"]) {
                return countryData;
            }
        }
        return null;
    }

    hoverInfo(e, countryId) {
        // Clears previous info boxes
        this.removeInfo();
        const countryData = this.getCountryData(countryId);
        const svgInfo = this.map_ref.current.getBoundingClientRect();
        const infoX = e.pageX - (svgInfo.x + window.scrollX);
        const infoY = e.pageY - (svgInfo.y + window.scrollY);
        const infoWidth = 200;
        const infoHeight = 100;
        const name = countryData !== null
            ? countryData["country_name"]
            : "Name not found";
        const score = countryData !== null &&
            Object.keys(countryData["democracy_scores"]).includes(this.props.year) &&
            countryData["democracy_scores"][this.props.year][this.props.scoreType] !== ""
            ? countryData["democracy_scores"][this.props.year][this.props.scoreType]
            : "No score available";
        d3.select(this.map_ref.current)
            .append('rect')
            .attr("id", "info")
            .attr("width", infoWidth + (name.length) * 5)
            .attr("height", infoHeight)
            .attr("x", infoX - (infoWidth / 2))
            .attr("y", infoY - infoHeight - 20)
            .attr("fill", "white")
            .attr("stroke", "black");
        d3.select(this.map_ref.current)
            .append("text")
            .text(name)
            .attr("x", infoX - (infoWidth / 2) + 10)
            .attr("y", infoY - infoHeight + 10)
            .attr("font-size", "20px")
            .attr("fill", "black")
            .attr("id", "infoText");
        d3.select(this.map_ref.current)
            .append("text")
            .text(score)
            .attr("x", infoX - (infoWidth / 2) + 10)
            .attr("y", infoY - infoHeight + 30)
            .attr("font-size", "20px")
            .attr("fill", "black")
            .attr("id", "infoScore");
    }

    removeInfo() {
        d3.select("#info")
            .remove();
        d3.select("#infoText")
            .remove();
        d3.select("#infoScore")
            .remove();
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
                    height="1000"
                    width="1000"
                    id="content"
                    ref={this.map_ref}
                    style={{margin:"auto"}}
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
                                id={country.iso}
                                fill={color}
                                stroke={"black"}
                                strokeWidth={"1"}
                                useColorTransition={true}
                                handle_country_mouseover={this.hoverInfo}
                                handle_country_mouseout={this.removeInfo}
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

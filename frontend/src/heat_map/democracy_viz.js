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
                    <div className={'slider'}>
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
        };
        this.csrftoken = getCookie('csrftoken');
        this.map_ref = React.createRef();
        this.getCountryData = this.getCountryData.bind(this);
        this.handleCountryClick = this.handleCountryClick.bind(this);
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

    handleCountryClick(countryCode) {
        const data = this.getCountryData(countryCode);
        if (data) {
            const countryScores = data["democracy_scores"];
            // Creates a list of lists where each inner list is formatted like so: [year, score]
            const allScoresOfType = Object.keys(countryScores).reduce((acc, el) => {
                acc.push([el, countryScores[el][this.props.scoreType]]);
                return acc;
            }, []);
            const height = 700;
            const width = window.innerWidth - 800;
            // Used code example from https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89
            const margin = {top: 40, right: 40, bottom: 40, left: 40};
            const xScale = d3.scaleLinear()
                .domain([1980, 2020])
                .range([0, width - margin.top - margin.bottom]);  // Add some margins to graph
            const yScale = d3.scaleLinear()
                .domain([0, 1])
                .range([height - margin.left - margin.right, 0]);

            const lineGen = d3.line()
                .x(d => xScale(d[0]))  // Index 0 is the x coordinate
                .y(d => yScale(d[1])); // Index 1 is the y coordinate

            const linePath = lineGen(allScoresOfType);

            if (d3.select(".lineGraph").empty()) {
                const chart = d3.select(".map")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("class", "lineGraph")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," +  margin.top + ")")
                    .attr("class", "innerLineGraph");
                chart.append("g")
                    .attr("transform",
                        "translate(0, " + (height - margin.bottom - margin.top) + ")")
                    .attr("class", "xAxis")
                    .call(d3.axisBottom(xScale));
                chart.append("g")
                    .call(d3.axisLeft(yScale));
                chart.append("path")
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("strokeWidth", "2")
                    .attr("d", linePath)
                    .attr("class", "line");
                chart.append("text")
                    .attr("x", width/2)
                    .attr("y", margin.top/2)
                    .attr("text-anchor", "middle")
                    .text(data.country_name)
                    .attr("class", "title");

            }
            // Re-sizes the width of the line graph
            else if (d3.select(".lineGraph")._groups[0][0].width.baseVal.value !== width) {
                d3.select(".lineGraph")
                    .attr("width", width);
                d3.select(".xAxis")
                    .remove();
                d3.select(".innerLineGraph")
                    .append("g")
                    .attr("transform",
                        "translate(0, " + (height - margin.bottom - margin.top) + ")")
                    .call(d3.axisBottom(xScale))
                    .attr("class", "xAxis");
            }
            d3.select(".line")
                .transition()
                .duration(2000)
                .attr("d", linePath);
            d3.select(".title")
                .transition()
                .duration(2000)
                .attr("x", width/2)
                .attr("y", margin.top/2)
                .text(data.country_name);
            d3.selectAll(".dot")
                .remove();
            d3.select(".innerLineGraph")
                .selectAll(".dot")
                .data(allScoresOfType)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d[0]))
                .attr("cy", d => yScale(d[1]))
                .attr("r", "5")
                .attr("fill", "blue")
                .attr("class", "dot");
        }
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
                    height="800"
                    width="700"
                    id="content"
                    ref={this.map_ref}
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
                                handle_country_click={() => this.handleCountryClick(country.iso)}
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


import React from 'react';
import * as PropTypes from 'prop-types';

import {
    project_features_and_create_svg_paths,
} from "../common";

import { MapPath } from "../UILibrary/components";
import * as d3 from "d3";
import "./slaveTradeViz.scss";

// TODO: once district maps are in (1) allow for options btwn countries and hardcode fake data
// TODO: probably DRC, MOZ, NGA, MLI


class AfricaMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map_data: null,
        };
    }

    async componentDidMount() {
        try {
            const res = await fetch('/api/africa_map_geojson/');
            const geo_json = await res.json();
            const map_data = project_features_and_create_svg_paths(
                geo_json,
                this.props.width,
                this.props.height
            );
            this.setState({
                map_data: map_data,
            });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (!this.state.map_data) {
            return(<div>Loading!</div>);
        }
        const colorScale = d3.scaleLinear()
            .domain([0, 1])
            .range(['yellow', 'red']);
        return(
            <>
                <svg
                    height={this.props.height}
                    width={this.props.width}
                >
                    {this.state.map_data.map((country, i) => {
                        const random_num = Math.random();

                        return (
                            <MapPath
                                key={i}
                                path={country.svg_path}
                                fill={colorScale(random_num)}
                                stroke="black"
                                strokeWidth="1"
                                useColorTransition={true}
                                handle_country_click={
                                    () => this.props.handleCountryClick(country.name)
                                }
                                handle_country_mouseover={
                                    () => this.props.handleMouseOver(country.name)
                                }
                            />
                        );
                    })}

                </svg>
            </>
        );
    }
}
AfricaMap.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    handleCountryClick: PropTypes.func,
    handleMouseOver: PropTypes.func,
};

class DistrictInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }
    render() {
        return(
            <div className={this.state.show ? "" : "d-hidden"}>
                <h3>{this.props.name}</h3>
                <strong> Initial: </strong>
                {this.props.initial_value}
                <br/>
                <strong> Current: </strong>
                {this.props.current_value}
            </div>
        );
    }
}
DistrictInfo.propTypes = {
    name: PropTypes.string,
    initial_value: PropTypes.number,
    current_value: PropTypes.number,
};

class AggregateData extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <h6>
                    Aggregate Data
                </h6>
                min, mean, median mode

            </div>
        );
    }
}

export class SlaveTradeViz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resource_counter: 100,
            slider_value: "0",
            clicked_country: "Select a province to change its values.",
            hovered_country: "",
            show_aggregate_data: false,
        };
        this.map_height = 600;
        this.map_width = 550;
    }

    handleSliderChange = (e) => {
        this.setState({
            slider_value: e.target.value,
        });
    }

    handleCountryClick = (name) => {
        this.setState({
            clicked_country: name,
        });
    }

    handleMouseOver = (name) => {
        this.setState({
            hovered_country: name,
        });
    }

    render() {
        let district_info;
        if (this.state.hovered_country) {
            // hardcoded values until we get data from the backend
            district_info = (
                <DistrictInfo
                    name={this.state.hovered_country}
                    initial_value={10}
                    current_value={12}
                />
            );
        }

        return (
            <>
                <div>
                    <h1>{this.state.resource_counter} left</h1>
                </div>
                <div className="slave-trade-viz">
                    <div
                        className="map-container"
                    >
                        <h3>Slave Exports</h3>
                        <AfricaMap
                            height={this.map_height}
                            width={this.map_width}
                            handleCountryClick={this.handleCountryClick}
                            handleMouseOver={this.handleMouseOver}
                        />
                        {
                            this.state.show_aggregate_data
                                ? <AggregateData/>
                                : ""
                        }

                    </div>
                    <div className="map-container">
                        <h3>Interpersonal Trust</h3>
                        <AfricaMap
                            height={this.map_height}
                            width={this.map_width}
                        />
                    </div>
                </div>
                <h5>
                    {this.state.clicked_country}
                </h5>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={this.state.value}
                    onChange={this.handleSliderChange}
                />
                <button
                    type="submit"
                    onClick={
                        () => this.setState({show_aggregate_data: !this.state.show_aggregate_data})
                    }
                >
                    Submit
                </button>
                {district_info}

            </>
        );
    }
}
SlaveTradeViz.propTypes = {
    value: PropTypes.string,
    current_country: PropTypes.string,
};

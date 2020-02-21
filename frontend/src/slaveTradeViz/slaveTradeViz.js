import React from 'react';
import * as PropTypes from 'prop-types';

import {
    project_features_and_create_svg_paths,
} from "../common";

import { MapPath } from "../UILibrary/components";
import * as d3 from "d3";

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
            const map_data = project_features_and_create_svg_paths(geo_json, this.props.scale);
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
                    height={this.props.scale * 1.5}
                    width={this.props.scale * 1.5}
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
                            />
                        );
                    })}

                </svg>
            </>
        );
    }
}
AfricaMap.propTypes = {
    scale: PropTypes.number,
    handleCountryClick: PropTypes.func,
};

export class SlaveTradeViz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "0",
            current_country: "",
        };
    }

    handleSliderChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }

    handleCountryClick = (name) => {
        this.setState({
            current_country: name,
        });
    }

    render() {
        return (
            <>
                <h1>Hello World</h1>
                <AfricaMap
                    scale={350}
                    handleCountryClick={this.handleCountryClick}
                />
                <AfricaMap
                    scale={350}
                />
                <h5>
                    {this.state.current_country}
                </h5>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={this.state.value}
                    onChange={this.handleSliderChange}
                />
            </>
        );
    }
}
SlaveTradeViz.propTypes = {
    value: PropTypes.string,
    current_country: PropTypes.string,
};

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
            <div>
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

// class AggregateData extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         return (
//             <div>
//                 <h3>
//                     Aggregate Data
//                 </h3>
//             </div>
//         );
//     }
// }

export class SlaveTradeViz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "0",
            clicked_country: "",
            hovered_country: "",
        };
        this.map_height = 600;
        this.map_width = 550;
    }

    handleSliderChange = (e) => {
        this.setState({
            value: e.target.value,
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
                <AfricaMap
                    height={this.map_height}
                    width={this.map_width}
                    handleCountryClick={this.handleCountryClick}
                    handleMouseOver={this.handleMouseOver}
                />
                <AfricaMap
                    height={this.map_height}
                    width={this.map_width}
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
                {district_info}
            </>
        );
    }
}
SlaveTradeViz.propTypes = {
    value: PropTypes.string,
    current_country: PropTypes.string,
};

import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

import { getCookie } from '../common'
import './map_quiz.css';

/**
 * Main component for the map quiz.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

export class MapQuizSVG extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: 29,
            lat: -22,
            zoom: 4,
            map_data: null,
            click_country: 'Nothing',
        };
        this.csrftoken = getCookie('csrftoken');
        this.map_ref = React.createRef();
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
            map_data.push({svg_path, name, postal});
        }
        return map_data;
    }

    handle_country_map_click(country) {
        this.setState({
            click_country: country.name,
        });
    }

    handle_country_list_click = (country) => {
        this.setState({
            click_country: country.name,
        });
    }

    render() {
        if (!this.state.map_data) {
            return (<div>Loading!</div>);
        }
        return (
            <div className="u-flex">
                <div className="map-wrapper">
                    <svg
                        height="1000"
                        width="800"
                        id="content"
                    >
                        {this.state.map_data.map((country, i) =>
                            (
                                <MapPath
                                    key={i}
                                    path={country.svg_path}
                                    id={country.postal}
                                    fill={
                                        this.state.click_country === country.name
                                            ? '#C17767'
                                            : '#E7D7C1'
                                    }
                                    handle_country_click={
                                        () => this.handle_country_map_click(country)
                                    }
                                />
                            )
                        )}
                    </svg>
                </div>
                <div>
                    <CountryList
                        className="list-wrapper"
                        map_data={this.state.map_data}
                        click_country={this.state.click_country}
                        handle_country_list_click={this.handle_country_list_click}
                    />
                </div>
            </div>
        )
    }
}

export class CountryList extends React.Component {
    render() {
        return (
            <span>
                <h3>Countries</h3>
                {this.props.map_data.map((country, i) => (
                    this.props.click_country === country.name ?
                        <button key={i} className={"u-red country-btn"}
                            onClick={() => this.props.handle_country_list_click(country)}>
                            {country.name}
                        </button> :
                        <button key={i} className={"country-btn"}
                            onClick={() => this.props.handle_country_list_click(country)}>
                            {country.name}
                        </button>
                ))}
            </span>
        );
    }
}
CountryList.propTypes = {
    map_data: PropTypes.array,
    click_country: PropTypes.string,
    handle_country_list_click: PropTypes.func,
}


export class MapPath extends React.Component {
    render() {
        return (
            <path
                d={this.props.path}
                stroke="white"
                strokeWidth="1"
                fill={this.props.fill}
                id={this.props.id}
                onClick={this.props.handle_country_click}
            ></path>
        );
    }
}
MapPath.propTypes = {
    path: PropTypes.string,
    id: PropTypes.string,
    fill: PropTypes.string,
    handle_country_click: PropTypes.func,
}

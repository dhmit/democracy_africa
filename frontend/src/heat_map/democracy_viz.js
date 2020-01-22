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
            democracy_data: null,
        };
    }

    /**
     * When this component is mounted to the DOM, get democracy score data from the server
     */
    async componentDidMount() {
        try {
            const res = await fetch('/api/democracy_scores/');
            const democracy_data = await res.json();
            console.log(democracy_data);
            this.setState({
                democracy_data: democracy_data,
            });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (!this.state.democracy_data) {
            return (<div>Loading!</div>);
        }
        return (
            <>
                Hello This is the heat map
                <DemocracyMap/>
            </>
        )
    }
}

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

    handle_country_mouseover(country) {
        this.setState({
            mouseover_country: country.name,
        })
    }

    render() {
        if (!this.state.map_data) {
            return (<div>Loading!</div>);
        }
        return (
            <>
                <div>{this.state.mouseover_country}</div>
                <svg
                    height="1000"
                    width="1000"
                    id="content"
                >
                    {this.state.map_data.map((country, i) =>
                        (
                            <MapPath
                                key={i}
                                path={country.svg_path}
                                id={country.postal}
                                fill={
                                    this.state.mouseover_country === country.name
                                        ? 'green'
                                        : 'red'
                                }
                                handle_country_mouseover={
                                    () => this.handle_country_mouseover(country)
                                }
                            />
                        )
                    )}
                </svg>
            </>
        )
    }
}

export class MapPath extends React.Component {
    render() {
        return (
            <path
                d={this.props.path}
                stroke="blue"
                strokeWidth="1"
                fill={this.props.fill}
                id={this.props.id}
                onMouseOver={this.props.handle_country_mouseover}
            />
        );
    }
}
MapPath.propTypes = {
    path: PropTypes.string,
    id: PropTypes.string,
    fill: PropTypes.string,
    handle_country_mouseover: PropTypes.func,
};

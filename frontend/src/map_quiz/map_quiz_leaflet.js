import React from 'react';
import {
    GeoJSON,
    Map,
} from "react-leaflet";

// import PropTypes from 'prop-types';  // uncomment once something has props!

import { getCookie } from '../common'
import './map_quiz.css';


/**
 * Main component for the map quiz.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

export class MapQuizLeaflet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: 29,
            lat: -22,
            zoom: 4,
            map_data: null,
        };
        this.csrftoken = getCookie('csrftoken');
    }

    /**
     * When this component is mounted to the DOM, get GeoJSON data from the server
     */
    async componentDidMount() {
        try {
            const res = await fetch('/api/africa_map_geojson/');
            const map_data = await res.json();
            console.log(map_data);
            this.setState({
                map_data: map_data,
            });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (!this.state.map_data) {
            return (<div>Loading!</div>);
        }
        const position = [this.state.lat, this.state.lng]
        const color_me = (color_str) => {
            return {
                color: color_str,
                weight: 3,
            }
        }
        const green_countries = this.state.map_data.features;
        const red_countries = this.state.map_data.features.slice(0, 10);

        return (
            <Map center={position} zoom={this.state.zoom}>
                <GeoJSON
                    data={green_countries}
                    style={() => color_me('green')}
                />
                <GeoJSON
                    data={red_countries}
                    style={() => color_me('red')}
                />
            </Map>
        )
    }
}


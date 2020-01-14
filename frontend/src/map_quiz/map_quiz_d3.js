import React from 'react';
import * as d3 from 'd3';
// import PropTypes from 'prop-types';  // uncomment once something has props!

import { getCookie } from '../common'
import './map_quiz.css';

/**
 * Main component for the map quiz.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

export class MapQuizD3 extends React.Component {
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
            const map_data = await res.json();
            console.log(map_data);
            this.setState({
                map_data: map_data,
            });
        } catch (e) {
            console.log(e);
        }
    }

    async componentDidUpdate() {
        const scale = 500;
        const projection = d3.geoMercator()
            .center([5, 15])
            .scale(scale)
            .translate([scale/2, scale/2]);

        const geoGenerator = d3.geoPath()
            .projection(projection);

        // Join the FeatureCollection's features array to path elements
        const u = d3.select('#content')
            .selectAll('path')
            .data(this.state.map_data.features);

        // Create path elements and update the d attribute using the geo generator
        u.enter()
            .append('path')
            .attr('d', geoGenerator)
            .attr("stroke", "blue")
            .attr("stroke-width", 1)
            .attr("fill", "red")
            .attr("id", (d) => d.properties.postal)
            .on('mouseover', (d, i, nodes) => {
                this.setState({
                    mouseover_country: d.properties.name,
                });
                d3.select(nodes[i]).attr('fill', 'green');
            })
            .on('mouseout', (d, i, nodes) => {
                this.setState({
                    mouseover_country: 'Nothing',
                });
                d3.select(nodes[i]).attr('fill', 'red');
            });
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
                    ref={this.map_ref}>
                </svg>
            </>
        )
    }
}





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
            mouseover_country: 'Nothing',
            selected_country: "",
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
        //const scale = 500;
        const projection = d3.geoMercator()
            .center([5, 15])
            //.scale(scale)
            //.translate([scale/2, scale/2]);

        const geoGenerator = d3.geoPath().projection(projection);
        projection.fitExtent([[0,0], [Math.min(window.innerWidth-50,800),
            Math.min(window.innerHeight-50,800)]], geo_json);

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

    handle_country_click(country) {
        if (this.state.selected_country === country.name) {
            this.setState({
                selected_country: "",
            })
        } else {
            this.setState({
                selected_country: country.name,
            })
        }
    }

    render() {
        if (!this.state.map_data) {
            return (<div>Loading!</div>);
        }

        const rows = [];
        for (let i = 0; i < this.state.map_data.length; i+=3) {
            if (i + 1 >= this.state.map_data.length) {
                rows.push([this.state.map_data[i].name, "", ""])
            } else if (i + 2 >= this.state.map_data.length) {
                rows.push([this.state.map_data[i].name, this.state.map_data[i+1].name, ""])
            } else {
                rows.push([this.state.map_data[i].name, this.state.map_data[i+1].name,
                    this.state.map_data[i+2].name])
            }

        }

        return (
            <>
                <div>Hovering over: {this.state.mouseover_country}</div>
                <div>{this.state.selected_country==="" ? "" : "Selected: " +
                    this.state.selected_country}</div>
                <div className="row">
                    <svg
                        height="800"
                        width="800"
                        id="content"
                        display="inline-block"
                        className="col-9"
                    >
                        {this.state.map_data.map((country, i) =>
                            (
                                <MapPath
                                    key={i}
                                    path={country.svg_path}
                                    id={country.postal}
                                    fill={
                                        this.state.selected_country === country.name
                                            ? '#756bb1' :
                                            this.state.mouseover_country === country.name
                                                ? "#bcbddc"
                                                : '#efedf5'
                                    }
                                    handle_country_mouseover={
                                        () => this.handle_country_mouseover(country)
                                    }
                                    handle_country_click={()=>this.handle_country_click(country)}
                                />
                            )
                        )}
                    </svg>
                    <div className="col-3">
                        <table className="countries_table">
                            <thead className="table_head">
                                <tr>
                                    <th colSpan={3}>
                                        Countries
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => {
                                    return (
                                        <tr key={index} className="countries_table_rows">
                                            <td className="countries_table_data">
                                                {row[0]}
                                            </td>
                                            <td className="countries_table_data">{row[1]}</td>
                                            <td className="countries_table_data">{row[2]}</td>
                                        </tr>)
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }
}

export class MapPath extends React.Component {
    render() {
        return (
            <path
                d={this.props.path}
                stroke="black"
                strokeWidth="1"
                fill={this.props.fill}
                id={this.props.id}
                onMouseOver={this.props.handle_country_mouseover}
                onClick={this.props.handle_country_click}
            ></path>
        );
    }
}
MapPath.propTypes = {
    path: PropTypes.string,
    id: PropTypes.string,
    fill: PropTypes.string,
    handle_country_mouseover: PropTypes.func,
    handle_country_click: PropTypes.func,
}

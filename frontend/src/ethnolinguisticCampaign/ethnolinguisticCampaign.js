import React from 'react';

import {
    MapPath,
} from "../UILibrary/components";

import {
    getCookie,
    project_features_and_create_svg_paths,
} from '../common';

/**
 * Main component for the map quiz.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

export class EthnolinguisticCampaign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map_data: null,
        };
        this.map_height = 800;
        this.map_width = 800;
        this.country_code = "";
        this.csrftoken = getCookie('csrftoken');
    }

    /**
     * When this component is mounted to the DOM, get GeoJSON data from the server
     */
    async componentDidMount() {
        try {
            const data = {
                country_code: "KEN",
            };
            const response = await fetch('/api/african_country_map_geojson/', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                }
            });
            const geo_json = await response.json();
            const map_data = project_features_and_create_svg_paths(geo_json, this.map_width,
                this.map_height);
            this.setState({
                map_data: map_data,
                country_code: "KEN"
            });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (!this.state.map_data) {
            return (<div>Loading!</div>);
        }
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <h1>Africa Map Quiz</h1>
                        <svg
                            height="800"
                            width="800"
                            id="content"
                        >
                            {this.state.map_data.map((country, i) => {
                                let countryFill = "#F6F4D2";

                                return <MapPath
                                    key={i}
                                    path={country.svg_path}
                                    id={country.postal}
                                    fill={countryFill}
                                    stroke="black"
                                    strokeWidth="1"
                                    handle_country_click={
                                        () => this.handle_country_map_click(country)
                                    }
                                    useColorTransition={false}
                                />;
                            })}
                        </svg>
                    </div>
                </div>
            </div>
        );
    }
}

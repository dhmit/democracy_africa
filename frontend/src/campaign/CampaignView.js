import React from 'react';
import {project_features_and_create_svg_paths} from "../common";
import {MapPath} from "../UILibrary/components";
// import * as PropTypes from 'prop-types';

export class CampaignView extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map_data: null,
            budgetData: null,
        };
    }

    /**
     * When this component is mounted to the DOM, get democracy score data from the server
     */
    async componentDidMount() {
        try {
            const map= await fetch('/api/state_map_geojson/ZAF', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                }
            });
            const geo_json = await map.json();
            const map_data = project_features_and_create_svg_paths(geo_json);
            const input_tracker = this.initialize_input_tracker(map_data);
            await this.setState({
                map_data: map_data,
                input_tracker: input_tracker,
                // budgetData: JSON.parse(budgetData),
            });
        } catch (e) {
            console.log(e);
        }
    }

    initialize_input_tracker(map_data) {
        const input_tracker = {};
        for (const feature of map_data) {
            input_tracker[feature.name] = "None";
        }
        return input_tracker;
    }

    render() {
        if (!this.state.map_data) {
            return (<div>Loading!</div>);

        }
        return (
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

                        useColorTransition={false}
                    />;
                })}
            </svg>
        );

    }
}

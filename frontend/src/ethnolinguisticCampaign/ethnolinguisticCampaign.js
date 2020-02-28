import React from 'react';
import * as PropTypes from 'prop-types';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
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
            population: null,
        };
        this.map_height = 600;
        this.map_width = 600;
        this.csrftoken = getCookie('csrftoken');
    }

    /**
     * When this component is mounted to the DOM, get GeoJSON data from the server
     */
    async componentDidMount() {
        try {
            const response = await fetch('/api/state_map_geojson/KEN/', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                }
            });
            const geo_json = await response.json();
            const map_data = project_features_and_create_svg_paths(geo_json, this.map_width,
                this.map_height);
            //TODO create a population and save it to this.state.population
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
                    <div className="col">

                    </div>
                </div>
                <div className="row">
                    <div className="col">

                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Component for displaying citizen information
 *
 * The fill indicates the citizen's stance on the budget,
 * and hovering over the component displays the citizen's traits
 */

class Citizen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
        };
    }

    render() {
        const statistic = (
            <Popover id={"popover-basic"}>
                <Popover.Title as={"h3"}> {this.props.data.name} </Popover.Title>
                <Popover.Content>
                    {Object.keys(this.props.data.characteristics).map((characteristic, key) =>
                        (<div key={key}>
                            <strong>
                                {characteristic.split("_").join(" ")}: &nbsp;
                            </strong>
                            {this.props.data.characteristics[characteristic] ? "True" : "False"}
                            <br/>
                        </div>)
                    )}
                </Popover.Content>
            </Popover>
        );
        return (
            <OverlayTrigger
                overlay={statistic}
                placement={"right"}
            >
                <svg  height="20" width="20">
                    <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill={this.props.data["activated"] ? "green" : "red"}
                    />
                </svg>
            </OverlayTrigger>
        );
    }
}
Citizen.propTypes = {
    data: PropTypes.object,
};

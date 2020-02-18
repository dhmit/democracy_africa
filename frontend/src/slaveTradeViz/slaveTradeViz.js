import React from 'react';
import {
    project_features_and_create_svg_paths,
} from "../common";

import { MapPath } from "../UILibrary/components";

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
            const map_data = project_features_and_create_svg_paths(geo_json, 250);
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

        return(
            <>
                <svg
                    height="1000"
                    width="1000"
                >
                    {this.state.map_data.map((country, i) =>
                        (<MapPath
                            key={i}
                            path={country.svg_path}
                            fill="grey"
                            stroke="black"
                            strokeWidth="1"
                            useColorTransition={true}
                        />),
                    )}
                </svg>
            </>
        );
    }
}

export class SlaveTradeViz extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <h1>Hello World</h1>
                <AfricaMap/>
                <AfricaMap/>
            </>
        );
    }
}

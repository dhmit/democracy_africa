import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

import { getCookie } from '../common'
import './heat_map.css';

/**
 * Main component for the map quiz.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

export class DemocracyViz extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            democracyData: null,
            scoreType: "v2x_polyarchy",
            year: "1981",
        };
    }

    /**
     * When this component is mounted to the DOM, get democracy score data from the server
     */
    async componentDidMount() {
        try {
            const res = await fetch('/api/democracy_scores/');
            const democracy_data = await res.json();
            this.setState({
                democracyData: JSON.parse(democracy_data),
            });
        } catch (e) {
            console.log(e);
        }
    }

    handleScoreTypeChange (e) {
        this.setState({
            scoreType: e.target.value,
        })
    }

    handleYearChange (e) {
        this.setState({
            year: e.target.value,
        })
    }

    render() {
        if (!this.state.democracyData) {
            return (<div>Loading!</div>);
        }
        return (
            <>
                <h1>Democracy in Africa Over Time</h1><hr/>
                Democracy Score Type: &nbsp;
                <select onChange={(e) => this.handleScoreTypeChange(e)}>
                    {Object.keys(this.state.democracyData[0]["democracy_scores"]["1981"]).map(
                        (entry, i) => (
                            <option key={i}>
                                {entry}
                            </option>
                        )
                    )}
                </select>
                <br/>
                <div className = 'slidecontainer'>
                    <div className={'map'}>
                        <input onChange={(e) => this.handleYearChange(e)}
                            type='range' id = 'year' name = 'year' min = '1981' max = '2018'
                            step = '1' className= 'slider'>
                        </input>
                    </div>
                    {this.state.year}
                </div>

                <br/>
                Currently grey either means:
                <ul>
                    {/*Remove this later once we fix data*/}
                    <li>Country doesn&apos;t exist in CSV</li>
                    {/*Maybe keep this bottom one*/}
                    <li>
                        The country does exist but there is no data for that particular
                        score type in that particular year
                    </li>
                </ul>
                <br/>
                <div className={'map'}>
                    <DemocracyMap
                        democracyData={this.state.democracyData}
                        scoreType={this.state.scoreType}
                        year={this.state.year}

                    />
                </div>
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
        this.getCountryData = this.getCountryData.bind(this);
        this.colorScale = d3.scaleLinear()
            .domain([0, 1])
            ///this seems like a nice africa color scheme so maybe try to figure out how to
            // add it

            //.range(["#ffffe5","#ffffe4","#fffee2","#fffee1","#fffee0","#fffedf","#fffddd",
            // "#fffddc",
            //     "#fffddb","#fffdd9","#fffcd8","#fffcd7","#fffcd6","#fffcd4","#fffbd3","#fffbd2",
            //     "#fffbd0","#fffacf","#ffface","#fffacc","#fff9cb","#fff9ca","#fff9c9","#fff8c7",
            //     "#fff8c6","#fff8c5","#fff7c3","#fff7c2","#fff7c1","#fff6bf","#fff6be","#fff5bd",
            //     "#fff5bc","#fff4ba","#fff4b9","#fff4b8","#fff3b6","#fff3b5","#fff2b4","#fff2b2",
            //     "#fff1b1","#fff1af","#fff0ae","#ffefad","#ffefab","#ffeeaa","#ffeea9","#ffeda7",
            //     "#feeca6","#feeca4","#feeba3","#feeaa1","#feeaa0","#fee99e","#fee89d","#fee89b",
            //     "#fee79a","#fee698","#fee697","#fee595","#fee493","#fee392","#fee390","#fee28e",
            //     "#fee18d","#fee08b","#fedf89","#fedf87","#fede86","#fedd84","#fedc82","#fedb80",
            //     "#feda7e","#fed97d","#fed87b","#fed779","#fed777","#fed675","#fed573","#fed471",
            //     "#fed370","#fed26e","#fed16c","#fed06a","#fecf68","#fece66","#fecd64","#fecc63",
            //     "#fecb61","#fec95f","#fec85d","#fec75b","#fec65a","#fec558","#fec456","#fec355",
            //     "#fec253","#fec051","#febf50","#febe4e","#febd4d","#febc4b","#feba4a","#feb948",
            //     "#feb847","#feb746","#feb544","#feb443","#feb341","#feb240","#feb03f","#feaf3e",
            //     "#feae3c","#feac3b","#fdab3a","#fdaa39","#fda938","#fda737","#fda635","#fda534",
            //     "#fda333","#fca232","#fca131","#fc9f30","#fc9e2f","#fc9d2e","#fb9b2d","#fb9a2c",
            //     "#fb992b","#fb972a","#fa962a","#fa9529","#fa9328","#f99227","#f99126","#f89025",
            //     "#f88e25","#f88d24","#f78c23","#f78a22","#f68921","#f68821","#f58620","#f5851f",
            //     "#f4841f","#f3831e","#f3811d","#f2801c","#f27f1c","#f17e1b","#f07c1a","#f07b1a",
            //     "#ef7a19","#ee7918","#ee7718","#ed7617","#ec7517","#eb7416","#eb7215","#ea7115",
            //     "#e97014","#e86f14","#e86e13","#e76c12","#e66b12","#e56a11","#e46911","#e36810",
            //     "#e2670f","#e1650f","#e1640e","#e0630e","#df620d","#de610d","#dd600c","#dc5f0c",
            //     "#db5e0b","#da5d0b","#d95b0a","#d75a0a","#d65909","#d55809","#d45708","#d35608",
            //     "#d25508","#d15407","#cf5307","#ce5207","#cd5106","#cc5006","#ca4f06","#c94e05",
            //     "#c84d05","#c74c05","#c54b05","#c44b05","#c24a04","#c14904","#c04804","#be4704",
            //     "#bd4604","#bb4504","#ba4504","#b84404","#b74304","#b54203","#b44103","#b24103",
            //     "#b14003","#af3f03","#ae3e03","#ac3e03","#ab3d03","#a93c03","#a83b04","#a63b04",
            //     "#a43a04","#a33904","#a13904","#a03804","#9e3704","#9c3704","#9b3604","#993604",
            //     "#983504","#963404","#943404","#933304","#913304","#903204","#8e3104","#8c3104",
            //     "#8b3005","#893005","#882f05","#862f05","#842e05","#832e05","#812d05","#802d05",
            //     "#7e2c05","#7c2c05","#7b2b05","#792b05","#782a05","#762a05","#742905","#732905",
            //     "#712806","#702806","#6e2706","#6c2706","#6b2606","#692606","#682506","#662506"])
            .range(['red', 'gold'])
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
            const iso = feature.properties.iso_a3; // Not sure if this is the correct ISO code
            map_data.push({svg_path, name, postal, iso});
        }
        return map_data;
    }

    // handle_country_mouseover(country) {
    //     this.setState({
    //         mouseover_country: country.name,
    //     })
    // }

    getCountryData(countryCode) {
        for (const countryData of this.props.democracyData) {
            if (countryCode === countryData["country_text_id"]) {
                return countryData;
            }
        }
    }

    render() {
        if (!this.state.map_data) {
            return (<div>Loading!</div>);
        }

        return (
            <>
                {/*<div>{this.state.mouseover_country}</div>*/}

                <svg
                    height="1000"
                    width="1000"
                    id="content"
                >
                    {this.state.map_data.map((country, i) => {
                        const countryData = this.getCountryData(country.iso);
                        // Using ternary because some country data doesn't exist
                        const countryScores = countryData
                            ? countryData["democracy_scores"][this.props.year]
                            : null;
                        const countryScore = countryScores
                            ? countryScores[this.props.scoreType]
                            : "";
                        const color = countryScore !== ""
                            ? this.colorScale(countryScore)
                            : "grey";
                        return (
                            <MapPath
                                key={i}
                                path={country.svg_path}
                                id={country.postal}
                                fill={color}
                            />
                        )
                    })}
                </svg>
            </>
        )
    }
}
DemocracyMap.propTypes = {
    democracyData: PropTypes.array,
    scoreType: PropTypes.string,
    year: PropTypes.string,
};

export class MapPath extends React.Component {
    render() {
        return (
            <path
                d={this.props.path}
                stroke="black"
                strokeWidth="1"
                fill={this.props.fill}
                id={this.props.id}
                // onMouseOver={this.props.handle_country_mouseover}
            />
        );
    }
}
MapPath.propTypes = {
    path: PropTypes.string,
    id: PropTypes.string,
    fill: PropTypes.string,
    // handle_country_mouseover: PropTypes.func,
};

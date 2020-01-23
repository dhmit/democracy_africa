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
            score : 0,
        };
        this.csrftoken = getCookie('csrftoken');
        this.map_ref = React.createRef();

        this.increment_score = this.increment_score.bind(this);
    }

    /**
     * When this component is mounted to the DOM, get GeoJSON data from the server
     */
    async componentDidMount() {
        try {
            const res = await fetch('/api/africa_map_geojson/');
            const geo_json = await res.json();
            const map_data = this.project_features_and_create_svg_paths(geo_json);
            const input_tracker = this.input_tracking(geo_json);
            this.setState({
                map_data: map_data,
                input_tracker: input_tracker,
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
            .translate([scale / 2, scale / 2]);

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

    input_tracking(geo_json) {
        const input_tracker = {};
        for (const feature of geo_json.features) {
            input_tracker[feature.properties.name] = null;
        }
        return input_tracker;
    }

    handle_country_map_click(country) {
        if (this.state.input_tracker[country] !== null) {
            this.setState({
                click_country: country.name,
            })
        }
        else {
            alert("You already guessed this country!");
        }
    }

    handle_country_list_click = (country) => {
        this.setState({
            click_country: country.name,
        });
    };

    increment_score(){
        console.log(this.state.score);
        this.setState(prevState => ({
            score: prevState.score + 1,
        }));
    }

    handle_visual_feedback = (answer, country) => {
        if (answer === 'Correct') {
            this.setState({
                fill: '#33cc33',
                input_tracker:{
                    [country]: true,
                }
            });
        }
        else if (answer === 'Incorrect') {
            this.setState({
                fill: '#ff0000',
                input_tracker: {
                    [country]: true,
                }
            });
        }
        alert("Hi");

    };

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
                <div className="u-flex input-wrapper">
                    <NameForm
                        map_data={this.state.map_data}
                        click_country={this.state.click_country}
                        result = 'None'
                        increment_score={this.increment_score}
                        handle_visual_feedback={
                            () => this.handle_visual_feedback('Correct', this.state.click_country)}
                    />
                </div>
                <div className="score">
                    {`Score : ${this.state.score}`}
                </div>
                <div className="timer">
                    <Timer/>
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
};


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
            />
        );
    }
}

export class Timer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            minutes : 5,
            seconds : 0,
        }
    }

    componentDidMount() {

    }

    startTimer = () => {
        this.interval = setInterval(() => {
            const {minutes, seconds} = this.state;
            if (seconds > 0) {
                this.setState((prevState) => ({
                    seconds: prevState.seconds - 1
                }))
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(this.interval)
                } else {
                    this.setState((prevState) => ({
                        minutes: prevState.minutes - 1,
                        seconds: 59
                    }))
                }
            }
        }, 1000)
    };

    stopTimer = () => {
        clearInterval((this.interval))
    };

    render() {
        const { minutes, seconds } = this.state;
        return(
            <div>
                <div>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>
                <button onClick={this.startTimer}>
                    Start
                </button>
                <button onClick={this.stopTimer}>
                    Stop
                </button>
            </div>
        );
    }
}


export class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        if (this.props.click_country === this.state.value) {
            alert(this.state.value + " is correct!");
            event.preventDefault();
            // this.props.result = "Correct";
            this.props.increment_score();
        }
        else {
            alert(this.state.value + " is incorrect...");
            alert("This country's name is: " + this.props.click_country);
            event.preventDefault();
            this.props.result = "Incorrect";
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Country Name:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

NameForm.propTypes = {
    map_data: PropTypes.array,
    click_country: PropTypes.string,
    increment_score : PropTypes.func,
    result: PropTypes.string,
};

MapPath.propTypes = {
    path: PropTypes.string,
    id: PropTypes.string,
    fill: PropTypes.string,
    handle_country_click: PropTypes.func,
};

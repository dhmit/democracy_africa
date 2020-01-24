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
            minutes : 0,
            seconds : 30,
        };
        this.csrftoken = getCookie('csrftoken');
        this.map_ref = React.createRef();

        this.handle_visual_feedback = this.handle_visual_feedback.bind(this);
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
            input_tracker[feature.properties.name] = "None";
        }
        return input_tracker;
    }

    handle_country_map_click(country) {
        if (this.state.input_tracker[country] === "None") {
            alert("You already guessed this country!");
        }
        else {
            this.setState({
                click_country: country.name,
            })
        }
    }

    // handle_country_list_click = (country) => {
    //     this.setState({
    //         click_country: country.name,
    //     });
    // };

    /**
     * Changes the color of the country depending on the validity of the user response
     * @param answer String that stores if the user's response was correct
     * @param country Current country that the user is guessing
     */
    handle_visual_feedback(answer, country) {
        if (answer === "Correct") {
            this.setState(prevState => ({
                input_tracker: {
                    ...prevState.input_tracker,
                    [country]: "Correct",
                }
            }));
        }
        else if (answer === "Incorrect") {
            this.setState(prevState => ({
                input_tracker: {
                    ...prevState.input_tracker,
                    [country]: "Incorrect",
                }
            }));
        }
    }

    render() {
        let score = 0;
        if (this.state.input_tracker) {
            const correct_responses = Object.values(this.state.input_tracker).filter(
                (input) => input === "Correct");
            score = correct_responses.length;
        }

        if (!this.state.map_data) {
            return (<div>Loading!</div>);
        }
        return (
            <div className="u-flex-column">
                <div className="map-wrapper">
                    <svg
                        height="1000"
                        width="800"
                        id="content"
                    >
                        {this.state.map_data.map((country, i) => {
                            let countryFill = "#F6F4D2";
                            if (this.state.input_tracker[country.name] === "Correct") {
                                countryFill = "#CBDFBD";
                            } else if (this.state.input_tracker[country.name] === "Incorrect") {
                                countryFill = "#F19C79";
                            } else if (this.state.click_country === country.name) {
                                countryFill = "#C0CCD3";
                            }

                            return <MapPath
                                key={i}
                                path={country.svg_path}
                                id={country.postal}
                                fill={countryFill}
                                handle_country_click={
                                    () => this.handle_country_map_click(country)
                                }
                            />
                        })}
                    </svg>
                </div>
                <div className="score">
                    {`Score : ${score}`}
                </div>
                <div className="u-flex input-wrapper">
                    <NameForm
                        map_data={this.state.map_data}
                        click_country={this.state.click_country}
                        handle_visual_feedback={this.handle_visual_feedback}
                    />
                </div>
                <div className="timer">
                    <Timer minutes={this.state.minutes} seconds={this.state.seconds}/>
                </div>
            </div>
        )
    }
}

/**
 * TODO : Improve the button layout and UI for the list of country names
 * Renders the names of the countries as clickable buttons and highlights the corresponding
 * country when clicked
 */
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

MapPath.propTypes = {
    path: PropTypes.string,
    id: PropTypes.string,
    fill: PropTypes.string,
    handle_country_click: PropTypes.func,
};

/**
 * TODO : Potentially add auto start/stop when user starts answering or finishes the quiz
 * Timer class that instantiates a timer with user start and stop functionality
 * Starts at 5 minutes and decrements by 1 second
 */
export class Timer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            minutes : props.minutes,
            seconds : props.seconds,
            //started represents whether or not the timer is currently counting down
            started : false,
        }
    }

    componentDidMount() {

    }

    startTimer = () => {
        if(this.state.started === false){
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
            this.setState({started : true});
        }
    };

    stopTimer = () => {
        clearInterval((this.interval))
        this.setState({started : false});
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

Timer.propTypes = {
    minutes : PropTypes.number,
    seconds : PropTypes.number,
}


/**
 * TODO : Prevent the user from re-submitting for previously missed or answered countries
 * Handles the user's submission of answers and alerts them to the accuracy of their response
 */
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
        if (this.props.click_country.toLowerCase() === this.state.value.toLowerCase()) {
            alert(this.state.value + " is correct!");
            event.preventDefault();
            this.props.handle_visual_feedback("Correct", this.props.click_country);
        }
        else {
            alert(this.state.value + " is incorrect...");
            alert("This country's name is: " + this.props.click_country);
            event.preventDefault();
            this.props.handle_visual_feedback("Incorrect", this.props.click_country);
        }
        this.setState({value  : ''});
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
    handle_visual_feedback: PropTypes.func,
};

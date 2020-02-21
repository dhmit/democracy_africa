import React from 'react';
import * as PropTypes from 'prop-types';

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

export class MapQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map_data: null,
            clicked_country: null,
            score: 0,
            minutes : 5,
            seconds : 0,
        };
        this.csrftoken = getCookie('csrftoken');
        this.map_ref = React.createRef();
        this.timer_ref = React.createRef();
        this.reset_map = this.reset_map.bind(this);
        this.handle_submit_answer = this.handle_submit_answer.bind(this);
    }

    /**
     * When this component is mounted to the DOM, get GeoJSON data from the server
     * When this component is mounted to the DOM, get GeoJSON data from the server
     */
    async componentDidMount() {
        try {
            const res = await fetch('/api/africa_map_geojson/');
            const geo_json = await res.json();
            const map_data = project_features_and_create_svg_paths(geo_json);
            const input_tracker = this.initialize_input_tracker(map_data);
            this.setState({
                map_data: map_data,
                input_tracker: input_tracker,
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

    handle_country_map_click(country) {
        this.timer_ref.current.startTimer();
        if (this.state.input_tracker[country.name] === "None") {
            this.setState({
                clicked_country: country.name,
            });
        }
    }

    /**
     * TODO: randomize the order of the next country (it's currently alphabetical)
     * Verifies whether or not the guess is correct and stores it in input tracker
     * then sets the clicked country to be one not yet guessed
     * @param answer String that stores the user's guess
     */
    handle_submit_answer(answer) {
        const selected_country = this.state.clicked_country;
        if (selected_country.toLowerCase() === answer.toLowerCase()) {
            this.setState(prevState => ({
                input_tracker: {
                    ...prevState.input_tracker,
                    [selected_country]: "Correct",
                }
            }));
        } else {
            this.setState(prevState => ({
                input_tracker: {
                    ...prevState.input_tracker,
                    [selected_country]: "Incorrect",
                }
            }));
        }
        // const country_list = Object.keys(this.state.input_tracker);
        //         // const unanswered_countries = country_list.filter((country) =>
        //         //     this.state.input_tracker[country] === "None" &&
        //         //     country !== this.state.clicked_country);
        //         // this.setState({ clicked_country: unanswered_countries[0] });
        this.setState({ clicked_country: null});
    }

    reset_map() {
        const input_tracker = this.initialize_input_tracker(this.state.map_data);
        this.setState({
            input_tracker: input_tracker,
        });
        this.timer_ref.current.resetTimer();
    }

    render() {
        let score = 0;
        if (this.state.input_tracker) {
            const correct_responses = Object.values(this.state.input_tracker).filter(
                (input) => input === "Correct");
            score = correct_responses.length;
            if(score === 54){
                this.timer_ref.current.stopTimer();
            }
        }
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
                                if (this.state.input_tracker[country.name] === "Correct") {
                                    countryFill = "#B8E39B";
                                } else if (this.state.input_tracker[country.name] === "Incorrect") {
                                    countryFill = "#F19C79";
                                } else if (this.state.clicked_country === country.name) {
                                    countryFill = "#C0CCD3";
                                }

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
                    <div className="col right-panel text-right">
                        <h2>{`Score: ${score}`}</h2>
                        <Timer
                            ref={this.timer_ref}
                            minutes={this.state.minutes}
                            seconds={this.state.seconds}
                        />
                        <button className="reset" onClick={this.reset_map}>Reset</button>
                        <NameForm
                            map_data={this.state.map_data}
                            clicked_country={this.state.clicked_country}
                            input_tracker={this.state.input_tracker}
                            handle_submit_answer={this.handle_submit_answer}
                        />
                        <div className='list-wrapper'>
                            <CountryButtons
                                map_data={this.state.map_data}
                                clicked_country={this.state.clicked_country}
                                input_tracker={this.state.input_tracker}
                                handle_submit_answer={this.handle_submit_answer}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Renders the names of the countries as clickable buttons and guesses that name for the
 * currently selected country
 */
export class CountryButtons extends React.Component {
    render() {
        return (
            <div className="mt-4">
                <h3>Countries</h3>
                <div className={"grid-container"}>
                    {this.props.map_data.map((country, i) => {
                        if (this.props.input_tracker[country.name] === "Correct") {
                            return (
                                <button
                                    key={i}
                                    className="country-btn country-btn-correct"
                                    disabled
                                >{country.name}
                                </button>
                            );
                        } else {
                            return (
                                <button key={i}
                                    className={"country-btn"}
                                    onClick={() => this.props.handle_submit_answer(country.name)}>
                                    {country.name}
                                </button>
                            );
                        }
                    })}
                </div>
            </div>
        );
    }
}
CountryButtons.propTypes = {
    map_data: PropTypes.array,
    clicked_country: PropTypes.string,
    input_tracker: PropTypes.object,
    handle_submit_answer: PropTypes.func,
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
        };
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
                    }));
                }
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(this.interval);
                    } else {
                        this.setState((prevState) => ({
                            minutes: prevState.minutes - 1,
                            seconds: 59
                        }));
                    }
                }
            }, 1000);
            this.setState({started : true});
        }
    };

    stopTimer = () => {
        clearInterval((this.interval));
        this.setState({started : false});
    };

    resetTimer = () => {
        this.setState({
            minutes : this.props.minutes,
            seconds : this.props.seconds,
        });
        this.stopTimer();
    };

    render() {
        const { minutes, seconds } = this.state;
        return(
            <span className="timer">
                Time remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
        );
    }
}

Timer.propTypes = {
    minutes : PropTypes.number,
    seconds : PropTypes.number,
};


/**
 * TODO : Prevent the user from re-submitting for a country right after they answer
 * Handles the user's submission of answers, passes value of input to handle_submit_answer
 */
export class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        event.preventDefault();
    }

    handleSubmit() {
        if (this.props.clicked_country !== null) {
            this.props.handle_submit_answer(this.state.value);
            this.setState({ value: '' });
        }
    }

    render() {
        return (
            <div className="name-form text-right">
                <form onSubmit={this.handleChange}>
                    <label htmlFor="country_name">Country name</label>
                    <input
                        name="country_name"
                        type="text"
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                    <button className={"submit-btn"} onClick={this.handleSubmit}>Submit</button>
                </form>
            </div>
        );
    }
}
NameForm.propTypes = {
    map_data: PropTypes.array,
    clicked_country: PropTypes.string,
    handle_submit_answer: PropTypes.func,
};

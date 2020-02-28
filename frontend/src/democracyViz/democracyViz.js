import React from 'react';
import * as PropTypes from 'prop-types';
import * as d3 from 'd3';

import { MapPath } from "../UILibrary/components";
import { QuestionContainer } from "../UILibrary/mapQuestions";

import {
    getCookie,
    project_features_and_create_svg_paths,
} from '../common';

/**
 * Main component for the map quiz.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

let questionjso = {
    "questions": [
        {
            "Question": "This is question 1",
            "Answers":
                {
                    "answer1": true,
                    "answer2": false,
                    "answer3": false,
                    "answer4": false
                }
        },
        {
            "Question": "This is question 2",
            "Answers":
                {
                    "answer1": true,
                    "answer2": false,
                    "answer3": false,
                    "answer4": false
                }
        },
        {
            "Question": "This is question 3",
            "Answers":
                {
                    "answer1": true,
                    "answer2": false,
                    "answer3": false,
                    "answer4": false
                }
        },
        {
            "Question": "This is question 4",
            "Answers":
                {
                    "answer1": true,
                    "answer2": false,
                    "answer3": false,
                    "answer4": false
                }
        }
    ]
};

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

    /**
     *  Handles the change in democracy score type
     */
    handleScoreTypeChange(e) {
        this.setState({
            scoreType: e.target.value,
        });
    }

    /**
     *  Handles the change in year
     */
    handleYearChange(e) {
        this.setState({
            year: e.target.value,
        });
    }

    render() {
        if (!this.state.democracyData) {
            return (<div>Loading!</div>);
        }
        return (
            <>
                <h1>Democracy in Africa Over Time</h1><hr/>
                {/*Democracy Score Type: &nbsp;*/}
                {/*<select onChange={(e) => this.handleScoreTypeChange(e)}>*/}
                {/*    <option>*/}
                {/*        v2x_polyarchy*/}
                {/*    </option>*/}
                {/*</select>*/}
                <br/><br/>
                <br/>
                <h3 >VDem Index Quiz</h3>
                <p>instructions for playing game and/pr motivating statement could go here</p>
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
                <QuestionDataBase/>
                <div className={'map'}>
                    <DemocracyMap
                        democracyData={this.state.democracyData}
                        scoreType={this.state.scoreType}
                        year={this.state.year}

                    />
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
            </>
        );
    }
}



export class QuestionDataBase extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            current_question: null,
            questions: questionjso,
            index: null,
            correct: null,
        };
    }

    async componentDidMount() {
        this.setState({
            index: 0,
            current_question: questionjso["questions"][0]["Question"],
        });
    }

    handleGoToNext(){
        this.setState({
            index: this.state.index + 1,
            current_question: this.state.questions["questions"][this.state.index]["Question"],
            correct: false,
        });
    }

    handleAnswer(){

    }

    render() {

        return (
            <QuestionContainer
                handleAnswer = {this.handleAnswer}
                handleGoToNext = {this.handleGoToNext}
                question={this.state.current_question}
                answers={[1,2,3,4]}
                correct_answer={1}
                correct = {null}

            />
        );
    }

}

QuestionDataBase.propTypes = {
    questions: PropTypes.object,
    current_question: PropTypes.number,
    index: PropTypes.number,
    correct: PropTypes.bool,
    handleAnswer: PropTypes.func,
    handleGoToNext: PropTypes.func,
};

export class DemocracyMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map_data: null,
            // mouseover_country: 'Nothing',
        };
        this.map_height = 0;
        this.map_width = 0;
        this.csrftoken = getCookie('csrftoken');
        // this.map_ref = React.createRef();
        this.getCountryData = this.getCountryData.bind(this);
    }

    /**
     * When this component is mounted to the DOM, get GeoJSON data from the server
     */
    async componentDidMount() {
        try {
            const  res =  await fetch('/api/africa_map_geojson/');
            const geo_json = await res.json();
            const map_data = project_features_and_create_svg_paths(geo_json, this.map_width,
                this.map_height);
            this.setState({
                map_data: map_data,
            });
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Gets the country data from the democracy data based on the countryCode
     * @param countryCode the ISO code of the country
     * @returns the country data associated with the country ISO code
     */
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
        const colorScale = d3.scaleLinear()
            .domain([0, 1])
            .range(['yellow', 'red']);
        return (
            <>
                <svg
                    height={document.parentElement.clientWidth}
                    width={document.parentElement.clientWidth}
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
                            ? colorScale(countryScore)
                            : "grey";
                        return (
                            // TODO: fix this later so we can actually read width of parent OR
                            //  figure out how to assign an ID
                            <div>
                                <MapPath
                                    key={i}
                                    path={country.svg_path}
                                    id={country.iso}
                                    fill={color}
                                    stroke={"black"}
                                    strokeWidth={"1"}
                                    useColorTransition={true}
                                />
                            </div>
                        );
                    })}
                </svg>
            </>
        );
    }
    async componentDidUpdate() {
        const scale = .9;
        if (this.state.map_height !== document.parentElement.clientWidth){
            const  res =  await fetch('/api/africa_map_geojson/');
            const geo_json = await res.json();
            this.setState({
                map_height: document.parentElement.clientWidth*scale,
                map_width: document.parentElement.clientWidth*scale,
                map_data: project_features_and_create_svg_paths(geo_json,
                    document.parentElement.clientWidth*scale,
                    document.parentElement.clientWidth*scale),
            });
        }
    }
}
DemocracyMap.propTypes = {
    democracyData: PropTypes.array,
    scoreType: PropTypes.string,
    year: PropTypes.string,
};


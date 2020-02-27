import React from 'react';
import {project_features_and_create_svg_paths} from "../common";
import {MapPath} from "../UILibrary/components";
import * as PropTypes from "prop-types";
import './campaign.scss';


const get_default_proposal = (topic_names) => {
    let proposal = {};
    topic_names.forEach((topic) => {
        proposal[topic] = 1;
    });
    return proposal;
};


class Speech extends React.Component {
    constructor(props){
        super(props);
        this.topic_names = Object.keys(this.props.population[0]["traits"]);
        this.state = {
            speechProposal: get_default_proposal(this.topic_names),
            result: 0,
            total: 4,
        };
        this.difference_threshold = 6;
        this.max_priority_points = 20;
    }

    /**
     * Resets the speech such that every topic has a value of 1.
     * Used when component mounts and upon onClick of a button
     */
    resetSpeech = () => {
        this.setState({
            speechProposal: get_default_proposal(this.topic_names),
            total: 4,
        }, () => {
            this.setState({result: this.countSupporters()});
        });
    };

    componentDidMount() {
        // For a given list of options set each value to 1
        this.resetSpeech();
    }

    /**
     * Handles when the slider changes by changing the state of what the maximum values should
     * be for each category and updates the number of supporters
     * @param e The event that is triggered, use e.target.value to get the value of the slider
     * @param topic Tells which topic the slider belongs to so that it updates the speech
     */
    handleSliderOnChange = (e, topic) => {
        const newVal = parseInt(e.target.value);
        const newProposal = this.state.speechProposal;
        let oldVal = newProposal[topic];
        if (this.state.total + newVal - oldVal <= this.max_priority_points ){
            newProposal[topic] = newVal;
            this.setState({
                speechProposal: newProposal,
                total: this.state.total + newVal - oldVal,
                result: this.countSupporters(),
            });
        }
    };

    /**
     * Determines whether a citizen will support you based on your speech.
     * @returns {number} Number of people that will support you
     */
    countSupporters = () => {
        let count = 0;
        this.props.population.forEach((citizen) => {
            let difference_score = 0;
            for (const topic in this.state.speechProposal) {
                difference_score += Math.abs(citizen['traits'][topic] -
                    this.state.speechProposal[topic]);
            }
            if (difference_score > this.difference_threshold){
                citizen.will_support = false;
            }
            else {
                citizen.will_support = true;
                count++;
            }
        });
        this.props.updatePopulation(this.props.population);
        return count;
    };

    render() {
        const topics = this.topic_names.map((topic, key) => (
            <div key={key} className="individual_slider_containers">
                <p className="slider_descriptor">
                    <strong>{topic}</strong> has {this.state.speechProposal[topic]} priority point.
                </p>
                <input
                    className="slider"
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={this.state.speechProposal[topic] + ""}
                    onChange={(e) => this.handleSliderOnChange(e, topic)}
                />
            </div>
        ));

        const supportString = this.state.result + " out of " + this.props.population.length +
        " people align with your priorities.";

        return(
            <>
                <div className={"province-info-text"}>
                    You have {this.max_priority_points - this.state.total} priority points left.
                </div>
                <br/>
                <div>
                    {topics}
                </div>

                <div className="support_string">
                    {supportString}
                </div>
                <div className="reset_button">
                    <button
                        type={"submit"}
                        onClick={this.resetSpeech}
                    > Reset </button>
                </div>
            </>
        );
    }
}
Speech.propTypes = {
    population: PropTypes.array,
    countryName: PropTypes.string,
    updatePopulation: PropTypes.func,
};

export class campaignView extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map_data: null,
            populationData: null,
            clicked_province: null,
        };
        this.map_height = 1200;
        this.map_width = 1200;
        this.updatePopulation = this.updatePopulation.bind(this);
        this.getProvinceInfo = this.getProvinceInfo.bind(this);
    }

    /**
     * When this component is mounted to the DOM, get democracy score data from the server
     */
    async componentDidMount() {
        try {
            const map= await fetch('/api/state_map_geojson/ZAF/', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                }
            });
            const geo_json = await map.json();
            const map_data = project_features_and_create_svg_paths(geo_json, this.map_width,
                this.map_height);
            await this.setState({
                map_data: map_data,
            });
        } catch (e) {
            console.log(e);
        }
        try {
            const data = {
                country_name: "South Africa",
            };
            const res = await fetch('/api/campaign_info/', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                }
            });
            const populationData = await res.json();
            this.setState({
                populationData: populationData,
            });
        }catch (e) {
            console.log(e);
        }
    }

    updatePopulation(newCitizenList) {
        const {populationData} = this.state;
        populationData.citizen_list = newCitizenList;
        this.setState({populationData});
    }

    getProvinceInfo() {
        const provinceInfo = {};
        for (const citizen of this.state.populationData.citizen_list) {
            const province = citizen['province'];
            if (!(province in provinceInfo)){
                provinceInfo[province] = {"totalPeople": 0, "totalSupporters": 0};
            }
            provinceInfo[province]["totalPeople"]++;
            if (citizen.will_support) {
                provinceInfo[province]["totalSupporters"]++;
            }
        }
        return provinceInfo;
    }

    handle_province_map_click(province) {
        this.setState({
            clicked_province: province,
        });
    }

    render() {
        if (!this.state.populationData) {
            return (<div>Loading!</div>);
        }
        const provinceInfo = this.getProvinceInfo();
        return (
            <>
                <h1>Campaign Game</h1><hr/>
                <Speech
                    population={this.state.populationData['citizen_list']}
                    countryName={"South Africa"}
                    updatePopulation={this.updatePopulation}
                />
                <hr/>
                {this.state.clicked_province &&
                    (
                        <div className={"province-info-text"}>
                            {this.state.clicked_province}&nbsp;has&nbsp;
                            {provinceInfo[this.state.clicked_province]["totalSupporters"]}
                            &nbsp;out of&nbsp;
                            {provinceInfo[this.state.clicked_province]["totalPeople"]}
                            &nbsp;people who support you.
                        </div>
                    )
                }
                <svg
                    height="600"
                    width="1200"
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
                            handle_country_click={() =>
                                this.handle_province_map_click(country.name)}
                            useColorTransition={false}
                        />;
                    })}
                </svg>
            </>
        );
    }
}

import React from 'react';
import * as PropTypes from "prop-types";

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
        this.difference_threshold = 5;
        this.max_priority_points = 13;
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
     * be for each category and updates the number of supporters and the budget proposal as a
     * whole
     * @param e The event that is triggered, use e.target.value to get the value of the slider
     * @param resource Tells which resource the slider belongs to so that it updates the budget
     * correctly
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
     * Determines whether a citizen will support the proposed budget.
     * @returns {number} Number of people that will support a given budget
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
                You have {this.max_priority_points - this.state.total} priority points left.
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
    country_name: PropTypes.string,
};

export class CampaignView extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            populationData: null,
        };
    }

    /**
     * When this component is mounted to the DOM, get democracy score data from the server
     */
    async componentDidMount() {
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
        } catch (e) {
            console.log(e);
        }
    }


    render() {
        if (!this.state.populationData) {
            return (<div>Loading!</div>);
        }
        return (
            <>
                <h1>Campaign Game</h1><hr/>
                <Speech
                    population={this.state.populationData['citizen_list']}
                    country_name={"South Africa"}
                />
            </>
        );
    }
}

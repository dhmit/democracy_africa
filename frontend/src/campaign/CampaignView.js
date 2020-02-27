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
    countryName: PropTypes.string,
    updatePopulation: PropTypes.func,
};

export class CampaignView extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            populationData: null,
        };
        this.updatePopulation = this.updatePopulation.bind(this);
        this.getProvinceInfo = this.getProvinceInfo.bind(this);
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

    render() {
        if (!this.state.populationData) {
            return (<div>Loading!</div>);
        }
        const provinceInfo = this.getProvinceInfo();
        console.log(provinceInfo);
        return (
            <>
                <h1>Campaign Game</h1><hr/>
                <div>
                    <h2>Province Info</h2>
                    <table border={1}>
                        <tbody>
                            <tr>
                                <th>Province</th>
                                <th>Supporters</th>
                                <th>Total People</th>
                            </tr>

                            {Object.keys(provinceInfo).map((province, k) => {
                                return (
                                    <tr key={k}>
                                        <td>{province}</td>
                                        <td>{provinceInfo[province]["totalSupporters"]}</td>
                                        <td>{provinceInfo[province]["totalPeople"]}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <Speech
                    population={this.state.populationData['citizen_list']}
                    countryName={"South Africa"}
                    updatePopulation={this.updatePopulation}
                />
            </>
        );
    }
}

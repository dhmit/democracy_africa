import React from 'react';
import PropTypes from 'prop-types';

import { getCookie }from "../common";

import "./Simulation.css"

/**
 * Main component for the simulation.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

// hardcoded list of resources for now
const resources = [
    "infrastructure",
    "electricity",
    "water",
    "sanitation",
    "education",
];

class Budget extends React.Component {
    // Once MainView is set up, there will be no state, but rather each will be a prop
    constructor(props){
        super(props);
        this.state = {
            reaction: null,
            budgetProposal: {}
        }

    }

    componentDidMount() {
        // for a given list of options set each value in budget proposal to 0
        let proposal = {};
        resources.forEach((resource) => {
            proposal[resource] = 0
        });
        this.setState({
            budgetProposal: proposal,
        });
    }

    simulateCitizenResponse = async () => {
        // check that the total doesn't exceed 100%
        if (this.validateInput()){
            const url = '/api/budget_response/';
            const data = {
                population: this.props.population,
                // hardcoded fake data for now
                budget: this.state.budgetProposal,
            }
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                }
            });
            const response_json = await response.json();
            this.setState({
                reaction: response_json,
            });
        } else { // otherwise throw an alert
            window.alert("Proposal exceeded budget");
        }
    }

    handleSliderOnChange = (e, resource) => {
        const newVal = e.target.value;
        const newProposal = this.state.budgetProposal;
        newProposal[resource] = newVal;

        this.setState({
            budgetProposal: newProposal,
        })
    }

    /*
    *  Return false is the proposal exceeds the budget
    */
    validateInput = () => {
        let sum = 0;
        Object.keys(this.state.budgetProposal).forEach((resource) =>
            sum += parseFloat(this.state.budgetProposal[resource]));
        return sum <= 1
    }


    render() {
        // TODO: once will_vote is implemented, display the results but for now, just display
        //  "submitted"
        let result = "";
        if (this.state.reaction)
            result = "submitted";

        const budgetOptions = Object.keys(this.state.budgetProposal).map((resource, key) => (
            <div key={key}>
                <strong> {resource} </strong>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={this.state.budgetProposal[resource]}
                    onChange={(e) => this.handleSliderOnChange(e, resource)}
                />
                {this.state.budgetProposal[resource]}
            </div>
        ));

        return(
            <>
                <div>
                    {budgetOptions}
                </div>

                <div>
                    <button
                        type="submit"
                        onClick={this.simulateCitizenResponse}
                    >
                        Submit Budget
                    </button>
                </div>

                <div>
                    {result}
                </div>

            </>
        )
    }
}
Budget.propTypes = {
    population: PropTypes.array,
};


class AggregateData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: Object.keys(this.props.population[0]["traits"])
        }
    }

    render() {
        const aggregate_values = {};
        for (let i = 0; i < this.state.categories.length; i++) {
            let total = 0;
            for (let j = 0; j < this.props.population.length; j++) {
                total += this.props.population[j]["traits"][this.state.categories[i]]
                //Above: index into the population to get a person, then that person's traits and
                //then the value (true or false) of that trait
            }
            aggregate_values[[this.state.categories[i]]] = total/this.props.population.length;
        }

        return (
            <table className="aggregate_data_table">
                <thead>
                    <tr>
                        <th className="aggregate_data_table_header">
                            Trait
                        </th>
                        <th className="aggregate_data_table_data">
                            Percentage of Population
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.categories.map((category, key) => {
                        return (
                            <tr key={key} className="aggregate_data_table_rows">
                                <td className="aggregate_data_table_data">
                                    {category}
                                </td>

                                <td className="aggregate_data_table_data">
                                    {(aggregate_values[category]*100).toFixed(2)}%
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }
}
AggregateData.propTypes = {
    population: PropTypes.array,
};

class MainView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            population: null,
        }
        this.csrftoken = getCookie('csrftoken');
    }

    async componentDidMount() {
        try {
            const population = await fetch('/api/population/');
            const json = await population.json();
            this.setState({population: json["get_population"]});
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (this.state.population) {
            return (
                <>
                    <div className="row">
                        <div className="col-12">
                            <AggregateData
                                population={this.state.population}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <Budget
                                population={this.state.population}
                            />
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <div>Loading!</div>
            )
        }

    }
}
export default MainView;

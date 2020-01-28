import React from 'react';
import PropTypes from 'prop-types';

import { getCookie }from "../common";

import "./BudgetSimulation.css";

/**
 * Main component for the simulation.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

// hardcoded list of resources for now
const resources = [
    "infrastructure",
    "electricity",
    "sanitation",
    "water",
    "education",
];

class Budget extends React.Component {
    // Once MainView is set up, there will be no state, but rather each will be a prop
    constructor(props){
        super(props);
        let maximums = resources.reduce((acc, elem) => {
            acc[elem] = 1; // or what ever object you want inside
            return acc;
        }, {});
        console.log(maximums);

        this.state = {
            reaction: null,
            budgetProposal: {},
            result: 0,
            maximums: maximums,
        };
    }

    componentDidMount() {
        // for a given list of options set each value in budget proposal to 0
        let proposal = {};
        resources.forEach((resource) => {
            proposal[resource] = 0;
        });
        this.setState({
            budgetProposal: proposal,
        });
    }

    handleSliderOnChange = (e, resource) => {
        const newVal = e.target.value;
        const newProposal = this.state.budgetProposal;
        let oldVal = newProposal[resource];
        newProposal[resource] = newVal;

        let maximums = resources.reduce((acc, elem) => {
            if (elem !== resource) {
                acc[elem] = Number((this.state.maximums[elem] - (newVal - oldVal)).toFixed(2));
            } else {
                acc[elem] = Number(this.state.maximums[elem].toFixed(2));
            }
            return acc;

        }, {});

        console.log(maximums);
        this.setState({
            budgetProposal: newProposal,
            result: this.countSupporters(),
            maximums: maximums,
        });
    };

    // TODO: add a validation/prevent user from exceeding budget
    countSupporters = () => {
        let count = 0;
        this.props.population.forEach((citizen) => {
            let needs = Object.keys(citizen["traits"]).filter((trait) => {
                return !citizen["traits"][trait];
            });
            let numOfNeeds = needs.length;
            if (numOfNeeds === 0) { return; }
            let numToVote = Math.ceil(numOfNeeds / 2);
            let cutoff = 0.75 / numOfNeeds;

            let numOfNeedsMet = 0;
            Object.keys(this.state.budgetProposal).forEach((resource) => {
                let proposal = this.state.budgetProposal[resource];
                if (needs.includes('lives_in_rural_area')
                    && resource === 'infrastructure') {
                    if (proposal >= cutoff) { numOfNeedsMet++; }
                }
                else if (needs.includes('is_educated')
                        && resource === 'education') {
                    if (proposal >= cutoff) { numOfNeedsMet++; }
                }
                else if (needs.includes('has_access_to_water')
                        && resource === 'water'){
                    if (proposal >= cutoff) { numOfNeedsMet++;  }
                }
                else if (needs.includes('has_access_to_sanitation')
                        && resource === 'sanitation') {
                    if (proposal >= cutoff) { numOfNeedsMet++;  }
                }
                else if (needs.includes('has_access_to_electricity')
                        && resource === 'electricity' ){
                    if (proposal >= cutoff) { numOfNeedsMet++;  }
                }
            });

            if (numOfNeedsMet >= numToVote) {
                count++;
            }

        });
        return count;
    };

    render() {
        console.log(this.state.maximums);
        const budgetOptions = Object.keys(this.state.budgetProposal).map((resource, key) => (
            <div key={key} className="individual_slider_containers">
                <p className="slider_descriptor">
                    {(this.state.budgetProposal[resource]*100).toFixed(0)}%
                    of the budget is being allocated towards <strong> {resource} </strong>
                </p>
                <input
                    className="slider"
                    type="range"
                    min="0"
                    max={this.state.maximums[resource]}
                    step="0.05"
                    value={this.state.budgetProposal[resource]}
                    onChange={(e) => this.handleSliderOnChange(e, resource)}
                />

            </div>
        ));
        const supportString = this.state.result + " out of " + this.props.population.length +
        " people support your budget";
        return(
            <>
                <div>
                    {budgetOptions}
                </div>

                <div>
                    {supportString}
                </div>

            </>
        );
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
        };
    }

    render() {
        const aggregate_values = {};
        for (let i = 0; i < this.state.categories.length; i++) {
            let total = 0;
            let category = this.state.categories[i];
            for (let j = 0; j < this.props.population.length; j++) {
                let citizen = this.props.population[j];
                total += citizen["traits"][category];
                //Above: index into the population to get the citizen, then that citizen's
                // traits and then the value (true or false) of that trait for each category
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
                                    {(aggregate_values[category]*100).toFixed(1)}%
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
AggregateData.propTypes = {
    population: PropTypes.array,
};

export class BudgetVotingSimViz extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            population: null,
        };
        this.csrftoken = getCookie('csrftoken');
    }

    async componentDidMount() {
        try {
            const population = await fetch('/api/population/');
            const json = await population.json();
            this.setState({population: json["citizen_list"]});
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (!this.state.population) {
            return (
                <div>Loading!</div>
            );
        }

        return (
            <>
                <div className="row">
                    <div className="col-md-8 col-lg-4 col-sm-12 data_container">
                        <AggregateData
                            population={this.state.population}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-8 col-lg-5 col-sm-12 budget_container">
                        <Budget
                            population={this.state.population}
                        />
                    </div>
                </div>
            </>
        );

    }
}

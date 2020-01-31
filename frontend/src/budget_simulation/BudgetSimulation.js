import React from 'react';
import PropTypes from 'prop-types';
import { getCookie }from "../common";
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import "./BudgetSimulation.css";

// import {parse} from "@typescript-eslint/parser/dist/parser";


// hardcoded list of resources for now
const resources = [
    "infrastructure",
    "electricity",
    "sanitation",
    "water",
    "education",
];

/**
 * Component for displaying citizen information
 *
 * The fill indicates the citizen's stance on the budget,
 * and hovering over the component displays the citizen's traits
 */

class Citizen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
        };
    }

    render() {
        const statistic = (
            <Popover id={"popover-basic"}>
                <Popover.Title as={"h3"}> {this.props.data.name} </Popover.Title>
                <Popover.Content>
                    {Object.keys(this.props.data.traits).map((trait, key) =>
                        (<div key={key}>
                            <strong>
                                {trait.split("_").join(" ")}: &nbsp;
                            </strong>
                            {this.props.data.traits[trait] ? "True" : "False"}
                            <br/>
                        </div>)
                    )}
                </Popover.Content>
            </Popover>
        );
        return (
            <OverlayTrigger
                overlay={statistic}
                placement={"right"}
            >
                <svg className={"budget-reaction-citizen"} height="20" width="20">
                    <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill={this.props.data["will_support"] ? "green" : "#c0c0c0"}
                    />
                </svg>
            </OverlayTrigger>
        );
    }
}
Citizen.propTypes = {
    data: PropTypes.object,
};

/**
 * Main component for the simulation.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

class Budget extends React.Component {
    // Once MainView is set up, there will be no state, but rather each will be a prop
    constructor(props){
        super(props);
        this.state = {
            budgetProposal: {},
            result: 0,
            total: 0,
            sampleSize: 100,
            showReactionSample: false,
        };
    }

    /**
     * Resets the budget such that every resource is allocated 0%.
     * Used when component mounts and upon onClick of a button
     */
    resetBudget = () => {
        let proposal = {};
        resources.forEach((resource) => {
            proposal[resource] = 0;
        });
        this.setState({
            budgetProposal: proposal,
            sampleSize: 100,
            total: 0,
        });
    }

    async componentDidMount() {
        // for a given list of options set each value in budget proposal to 0
        this.resetBudget();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.country_name !== this.props.country_name
            || prevState.budgetProposal !== this.state.budgetProposal) {
            this.setState({
                result: this.countSupporters(),
            });
        }
    }

    /**
     * Handles when the slider changes by changing the state of what the maximum values should
     * be for each category and updates the number of supporters and the budget proposal as a
     * whole
     * @param e The event that is triggered, use e.target.value to get the value of the slider
     * @param resource Tells which resource the slider belongs to so that it updates the budget
     * correctly
     */
    handleSliderOnChange = (e, resource) => {
        const newVal = parseFloat(e.target.value);
        const newProposal = this.state.budgetProposal;
        let oldVal = newProposal[resource];
        if (this.state.total + newVal - oldVal <= 100 ){
            newProposal[resource] = newVal;
            this.setState({
                budgetProposal: newProposal,
                total: this.state.total + newVal - oldVal,
                result: this.countSupporters(),
            });
        }
    };

    /**
     * Determines whether a citizen will support the proposed budget. Right now it is hardcoded
     * with the following logic: a person's needs are all of the attributes that are currently
     * false. A need is met by the budget if the proportion for that need is greater than
     * .75/# of needs. The person will support the budget if their # of needs/2, rounded up,
     * are met
     * @returns {number} Number of people that will support a given budget
     */
    countSupporters = () => {
        let count = 0;
        this.props.population.forEach((citizen) => {
            let needs = Object.keys(citizen["traits"]).filter((trait) => {
                return !citizen["traits"][trait];
            });
            let numOfNeeds = needs.length;
            if (numOfNeeds === 0) { return; }
            let numToVote = Math.ceil(numOfNeeds / 2);
            let cutoff = 75 / numOfNeeds;

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

            // update the citizen's attribute with the result
            if (numOfNeedsMet >= numToVote) {
                count++;
                citizen.will_support = true;
            } else {
                citizen.will_support = false;
            }
        });
        return count;
    };

    /**
     * Handles when the input for sample size changes.
     * Any attempts at inputting a number greater than the max
     * (in our case, the total population) will default to the max.
     */
    handleInputChange = (e) => {
        const newVal = e.target.value;
        if (newVal === ""
            || parseInt(newVal) < this.props.population.length) {
            this.setState({
                sampleSize: e.target.value,
            });
        } else {
            this.setState({
                sampleSize: this.props.population.length,
            });
        }
    }
    render() {

        const budgetOptions = Object.keys(this.state.budgetProposal).map((resource, key) => (
            <div key={key} className="individual_slider_containers">
                <p className="slider_descriptor">
                    {(this.state.budgetProposal[resource]).toFixed(0)}%
                    of the budget is being allocated towards <strong> {resource} </strong>
                </p>
                <input
                    className="slider"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={this.state.budgetProposal[resource] + ""}
                    onChange={(e) => this.handleSliderOnChange(e, resource)}
                />

            </div>
        ));

        const supportString = this.state.result + " out of " + this.props.population.length +
        " people support your budget";

        const reactions = this.props.population.slice(0,this.state.sampleSize).map((citizen,key) =>
            <Citizen key={key} data={citizen}/>
        );

        return(
            <>
                <div>
                    {budgetOptions}
                </div>

                <div>
                    {supportString}
                </div>
                <button
                    type={"submit"}
                    onClick={this.resetBudget}
                > Reset </button>

                <div>
                    Sample size:
                    <input
                        type={"number"}
                        name={"sampleSize"}
                        step={"1"}
                        min={"0"}
                        max={this.props.population.length}
                        value={this.state.sampleSize}
                        onChange={this.handleInputChange}
                    />
                    <div className={"budget-reaction"}>
                        {reactions}
                    </div>
                </div>
            </>
        );
    }
}
Budget.propTypes = {
    population: PropTypes.array,
    country_name: PropTypes.string,
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
            countries: null,
            country_name: "South Africa",
        };
        this.csrftoken = getCookie('csrftoken');
    }

    async componentDidMount() {
        this.update_population(this.state.country_name);
        try {
            const response = await fetch('/api/country_demographics/');
            const listOfCountries = await response.json();
            this.setState({
                countries: JSON.parse(listOfCountries),
            });
        } catch (e) {
            console.log(e);
        }
    }

    async update_population(selected_country) {
        try {
            const data = {
                country_name: selected_country,
            };
            const response = await fetch('/api/population/', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                }
            });
            const population = await response.json();
            this.setState({population: population["citizen_list"],
                country_name: selected_country});
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

        let countrySelection = "";
        if (this.state.countries) {
            countrySelection = this.state.countries.map((country, key) => {
                return (<option key={key} value={country}>{country}</option>);
            });
        }

        return (
            <>
                <div className="row">
                    <div className="form-group">
                        <select className="form-control float-left"
                            value={this.state.country_name}
                            onChange={(e) => this.update_population(e.target.value)}
                        >
                            {countrySelection}
                        </select>
                    </div>
                </div>

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
                            country_name={this.state.country_name}
                            population={this.state.population}
                        />
                    </div>
                </div>
            </>
        );

    }
}

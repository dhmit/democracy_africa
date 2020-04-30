import React from 'react';
import * as PropTypes from 'prop-types';

import Popover from 'react-bootstrap/Popover';
import PopoverContent from 'react-bootstrap/PopoverContent';
import { Citizen } from '../campaign/campaignView.js';
import { getCookie } from '../common';


// hardcoded list of resources for now
const resources = [
    'infrastructure',
    'electricity',
    'water',
    'sanitation',
    'education',
];


/**
 * Main component for the simulation.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

class Budget extends React.Component {
    // Once MainView is set up, there will be no state, but rather each will be a prop
    constructor(props) {
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
        const proposal = {};
        resources.forEach((resource) => {
            proposal[resource] = 20;
        });
        this.setState({
            budgetProposal: proposal,
            total: 100,
            result: 0,
            sampleSize: 100,
        });
    };

    componentDidMount() {
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
        const oldVal = newProposal[resource];
        if (this.state.total + newVal - oldVal <= 100) {
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
            const needs = Object.keys(citizen['traits']).filter((trait) => {
                return !citizen['traits'][trait];
            });
            const numOfNeeds = needs.length;
            if (numOfNeeds === 0) { return; }
            const numToVote = Math.ceil(numOfNeeds / 2);
            const cutoff = 75 / numOfNeeds;

            let numOfNeedsMet = 0;
            Object.keys(this.state.budgetProposal).forEach((resource) => {
                const proposal = this.state.budgetProposal[resource];
                if (needs.includes('lives_in_rural_area')
                    && resource === 'infrastructure') {
                    if (proposal >= cutoff) { numOfNeedsMet++; }
                } else if (needs.includes('is_educated')
                        && resource === 'education') {
                    if (proposal >= cutoff) { numOfNeedsMet++; }
                } else if (needs.includes('has_access_to_water')
                        && resource === 'water') {
                    if (proposal >= cutoff) { numOfNeedsMet++; }
                } else if (needs.includes('has_access_to_sanitation')
                        && resource === 'sanitation') {
                    if (proposal >= cutoff) { numOfNeedsMet++; }
                } else if (needs.includes('has_access_to_electricity')
                        && resource === 'electricity') {
                    if (proposal >= cutoff) { numOfNeedsMet++; }
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
        if (newVal === ''
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

    generateDescription(data) {
        const traits = Object.keys(data.traits).map((trait, i) => {
            const hasTrait = data.traits[trait];
            const numTraits = Object.keys(data.traits).length;
            let prose = trait.split('_').join(' ');
            if (!hasTrait) {
                prose = prose
                    .replace('has', 'does not have')
                    .replace('is', 'is not');
            }
            if (i === numTraits - 2) {
                prose += ', and';
            } else if (i === numTraits - 1) {
                prose += '.';
            } else {
                prose += ', ';
            }

            return (<span key={i}> {prose} </span>);
        });
        return (
            <div>
                Citizen {data.name}
                {traits}
            </div>
        );
    }

    render() {
        const budgetOptions = Object.keys(this.state.budgetProposal).map((resource, key) => (
            <div key={key} className='individual_slider_containers'>
                <p className='slider_descriptor'>
                    {(this.state.budgetProposal[resource]).toFixed(0)}%
                    of the budget is being allocated towards <strong> {resource} </strong>
                </p>
                <input
                    className='slider'
                    type='range'
                    min='0'
                    max='100'
                    step='1'
                    value={`${this.state.budgetProposal[resource]}`}
                    onChange={(e) => this.handleSliderOnChange(e, resource)}
                />

            </div>
        ));

        const supportString = `${this.state.result} out of ${this.props.population.length}`
             + 'people support your budget';

        const sample = this.props.population.slice(0, this.state.sampleSize);
        const reactions = sample.map((citizen, key) => <Citizen
                key={key}
                data={citizen}
                title={`About citizen ${citizen.name}`}
                generateDescription={this.generateDescription}
            />);

        return (
            <>
                <div>
                    {budgetOptions}
                </div>

                <div className='support_string'>
                    {supportString}
                </div>
                <div className='reset_button'>
                    <button
                        type={'submit'}
                        onClick={this.resetBudget}
                    > Reset </button>
                </div>
                <div>
                    Sample size:
                    <input
                        type={'number'}
                        name={'sampleSize'}
                        step={'1'}
                        min={'0'}
                        max={this.props.population.length}
                        value={this.state.sampleSize}
                        onChange={this.handleInputChange}
                    />
                    <div className={'budget-reaction'}>
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
        const selections = {};
        for (const trait of Object.keys(this.props.population[0]['traits'])) {
            selections[trait] = false;
        }
        this.state = {
            categories: Object.keys(this.props.population[0]['traits']),
            selected: selections,
            overall_selection: false,
        };
    }

    /**
     * When a user clicks on a table row, this method updates the state so that it knows that
     * row is selected
     * @param row_trait The trait of the row that has been selected (used for indexing)
     */
    select_table_row(row_trait) {
        const selections = this.state.selected;
        let any_selected = this.state.overall_selection;

        selections[row_trait] = !selections[row_trait];

        // @DOUBLE-CHECK THIS WORKS
        // @DOUBLE-CHECK THIS WORKS
        // @DOUBLE-CHECK THIS WORKS
        // @DOUBLE-CHECK THIS WORKS
        // @DOUBLE-CHECK THIS WORKS
        for (const trait of Object.keys(selections)) {
            if (selections[trait]) {
                any_selected = true;
                break;
            }
            any_selected = false;
        }

        this.setState({ selected: selections, overall_selection: any_selected });
    }

    /**
     * Generates the data to put into the overlay. The data in this case being the number of
     * people who lack the selected characteristics
     *
     * return: String which states the number of people that lack the given characteristics
     */
    generate_data() {
        const selections = this.state.selected;
        let total = 0;
        const { population } = this.props;
        for (let i = 0; i < population.length; i++) {
            let should_count_person = true;
            const person = population[i];
            for (const attribute in person['traits']) {
                if (selections[attribute] === undefined) {
                    if (person['traits'][attribute]) {
                        should_count_person = false;
                        break;
                    }
                } else if (selections[attribute] && person['traits'][attribute]) {
                    should_count_person = false;
                    break;
                }
            }
            if (should_count_person) {
                total += 1;
            }
        }

        return `${String(total)} people lack this combination of traits`;
    }

    render() {
        const aggregate_values = {};
        const total_values = {};
        for (let i = 0; i < this.state.categories.length; i++) {
            let total = 0;
            const category = this.state.categories[i];
            for (let j = 0; j < this.props.population.length; j++) {
                const citizen = this.props.population[j];
                total += citizen['traits'][category];
                // Above: index into the population to get the citizen, then that citizen's
                // traits and then the value (true or false) of that trait for each category
            }
            aggregate_values[category] = total / this.props.population.length;
            total_values[category] = total;
        }
        // Usses the React-bootstrap Overlay and Popover classes. See
        // https://react-bootstrap.github.io/components/overlays/#overlay-props for more details
        return (
            <div className='row'>
                <div className='col-9'>
                    <table className='aggregate_data_table'>
                        <thead>
                            <tr>
                                <th className='aggregate_data_table_header'>
                                    Trait
                                </th>
                                <th className='aggregate_data_table_data'>
                                    Percentage of Population
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.categories.map((category, key) => {
                                let category_name = category.replace(/_/g, ' ');
                                const first_letter = category_name[0];
                                category_name = category_name.replace(first_letter,
                                    first_letter.toUpperCase());

                                let table_row_classnames = 'aggregate_data_table_rows';
                                if (this.state.selected !== null
                                    && this.state.selected[category]) {
                                    table_row_classnames += ' selected_row';
                                }
                                return (
                                    <tr key={key} className={table_row_classnames}
                                        onClick={() => this.select_table_row(category)}>
                                        <td className='aggregate_data_table_data'>
                                            {category_name}
                                        </td>
                                        <td className='aggregate_data_table_data'>
                                            {(aggregate_values[category] * 100).toFixed(1)}%
                                            ({total_values[category]})
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
                <div className='col-3'>
                    <Popover id='popover-basic'>
                        <PopoverContent>
                            {this.state.overall_selection ? this.generate_data()
                                : 'Click on different rows to see the amount of the population '
                        + 'lacking those characteristics'}
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

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
            country_name: 'South Africa',
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
                },
            });
            const population = await response.json();
            this.setState({
                population: population['citizen_list'],
                country_name: selected_country,
            });
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

        let countrySelection = '';
        if (this.state.countries) {
            countrySelection = this.state.countries.map((country, key) => {
                return (<option key={key} value={country}>{country}</option>);
            });
        }

        return (
            <>
                <h1>Budget Voting Simulation</h1>
                <div className='row instructions' >
                    <p>Use this dropdown menu to select different countries</p>
                </div>
                <div className='row'>
                    <div className='col-md-8 col-lg-4 col-sm-12 form-group country_list'>
                        <select className='form-control '
                            value={this.state.country_name}
                            onChange={(e) => this.update_population(e.target.value)}
                        >
                            {countrySelection}
                        </select>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-md-8 col-lg-4 col-sm-12 data_container'>
                        <AggregateData
                            population={this.state.population}
                        />
                    </div>
                </div>

                <div className='row'>
                    <div className='col-md-8 col-lg-6 col-sm-12 budget_container'>
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

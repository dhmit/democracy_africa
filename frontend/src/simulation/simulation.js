import React from 'react';
import PropTypes from 'prop-types';

// import { getCookie }from "../common";


/**
 * Main component for the simulation.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

class Budget extends React.Component {
    //FAKE_PEOPLE are now all under this.props.population
    constructor(props) {
        super(props);
        this.state = {
            reaction: null,
        }

    }
    simulateCitizenResponse = async () => {
        const url = '/api/budget_response/';
        const data = {
            population: this.props.population,
            // hardcoded fake data for now
            budget: {
                "infrastructure": 0.1,
                "education": 0.2,
                "sanitation": 0.5,
                "water": 0.1,
                "electricity": 0.1,
            },
        }
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json',
            }
        });
        const response_json = await response.json();
        console.log(response_json);
        this.setState({
            reaction: response_json,
        })
    }

    render() {
        let result = "Submit budget";
        if (this.state.reaction) {
            result = Object.keys(this.state.reaction["budget"]).map((resource) => (
                <>
                    <strong>{resource}:</strong>
                    {this.state.reaction["budget"][resource]}
                    <br/>
                </>
            ))
        }
        return(
            <>
                <button
                    type="submit"
                    onClick={this.simulateCitizenResponse}
                >
                    Submit
                </button>

                {result}

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
        // eslint-disable-next-line react/prop-types
        this.state = {
            // eslint-disable-next-line react/prop-types
            categories: Object.keys(this.props.population[0]["traits"])
        }
    }

    render() {
        const aggregate_values = {};
        for (let i = 0; i < this.state.categories.length; i++) {
            let total = 0;
            // eslint-disable-next-line react/prop-types
            for (let j = 0; j < this.props.population.length; j++) {
                total += this.props.population[j]["traits"][this.state.categories[i]]
                //Above: index into the population to get a person, then that person's traits and
                //then the value (true or false) of that trait
            }
            aggregate_values[[this.state.categories[i]]] = total/this.props.population.length;
        }

        return (
            <table>
                <tbody>
                    {this.state.categories.map((category, key) => {
                        return (
                            <tr key={key}>
                                <td>{category}</td>
                                <td>{(aggregate_values[category]*100).toFixed(2)}%</td>
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
                    <AggregateData
                        population={this.state.population}
                    />

                    <Budget
                        population={this.state.population}
                    />
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

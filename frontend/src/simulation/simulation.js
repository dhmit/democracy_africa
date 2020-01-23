import React from 'react';
// import { getCookie }from "../common";

// import PropTypes from 'prop-types';

/**
 * Main component for the simulation.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

// const FAKE_PEOPLE = [
//     {
//         "name": "person0",
//         "traits": {
//             "lives_in_rural_area": true,
//             "has_access_to_electricity": false,
//             "has_access_to_water": true,
//             "has_access_to_sanitation": false,
//             "is_educated": true,
//         },
//         "will_support": false,
//     },
//     {
//         "name": "person1",
//         "traits": {
//             "lives_in_rural_area": true,
//             "has_access_to_electricity": false,
//             "has_access_to_water": false,
//             "has_access_to_sanitation": false,
//             "is_educated": true,
//         },
//         "will_support": false,
//     },
//     {
//         "name": "person2",
//         "traits": {
//             "lives_in_rural_area": false,
//             "has_access_to_electricity": false,
//             "has_access_to_water": true,
//             "has_access_to_sanitation": true,
//             "is_educated": true,
//         },
//         "will_support": false,
//     },
// ];



class Budget extends React.Component {
    //FAKE_PEOPLE are now all under this.props.population
    constructor(props) {
        super(props);

        this.state = {
            budgetResponse: null,
        }

    }
    simulateCitizenResponse = async () => {
        const url = '/api/budget_response/';
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-type': 'application/json',
            }
        });
        const response_json = await response.json();
        console.log(response_json);
        this.setState({
            budgetResponse: response_json,
        })
    }

    render() {
        let result = "Submit budget";
        if (this.state.budgetResponse) {
            result = `yay = ${this.state.budgetResponse.yay} 
            and nay = ${this.state.budgetResponse.nay}`
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
                // eslint-disable-next-line react/prop-types
                total += this.props.population[j]["traits"][this.state.categories[i]]
            }
            // eslint-disable-next-line react/prop-types
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

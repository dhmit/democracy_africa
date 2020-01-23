import React from 'react';
import PropTypes from 'prop-types';

// import { getCookie }from "../common";


/**
 * Main component for the simulation.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

class Budget extends React.Component {
    //Once MainView is set up, there will be no state, but rather each will be a prop
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
}


class AggregateData extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (<></>)
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

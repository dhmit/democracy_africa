import React from 'react';
import * as PropTypes from 'prop-types';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {
    MapPath,
} from "../UILibrary/components";

import {
    getCookie,
    project_features_and_create_svg_paths,
} from '../common';

/**
 * Main component for the map quiz.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

export class EthnolinguisticCampaign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map_data: null,
            population:
                [{name: "1", demographics:{language:"Turkana", ethnic_group: "Kalenjin",
                    occupation:"Never had a job", religion:"Orthodox"}, traits: {}},
                {name: "2", demographics:{language:"English", ethnic_group: "Kalenjin",
                    occupation:"Never had a job", religion:"Christian"}, traits: {}}],
        };
        this.map_height = 600;
        this.map_width = 600;
        this.csrftoken = getCookie('csrftoken');
    }

    /**
     * When this component is mounted to the DOM, get GeoJSON data from the server
     */
    async componentDidMount() {
        try {
            const response = await fetch('/api/state_map_geojson/KEN/', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                }
            });
            console.log("Got this far");
            console.log(response);
            const geo_json = await response.json();
            const map_data = project_features_and_create_svg_paths(geo_json, this.map_width,
                this.map_height);
            //TODO create a population and save it to this.state.population
            this.setState({
                map_data: map_data,
            });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (!this.state.map_data) {
            return (<div>Loading!</div>);
        }
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <h1>Africa Map Quiz</h1>
                        <svg
                            height="800"
                            width="800"
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
                                    handle_country_click={
                                        () => this.handle_country_map_click(country)
                                    }
                                    useColorTransition={false}
                                />;
                            })}
                        </svg>
                    </div>
                    <div className="col">

                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h1>Ethno-Linguistic Campaign Simulation</h1>

                        <div className="row">
                            <div className="col-md-8 col-lg-6 col-sm-12 budget_container">
                                <Campaign
                                    country_name={this.state.country_name}
                                    population={this.state.population}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

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
                    {Object.keys(this.props.data.demographics).map((demographic, key) =>
                        (<div key={key}>
                            <strong>
                                {demographic.split("_").join(" ")}: &nbsp;
                            </strong>
                            {this.props.data.demographics[demographic] ? "True" : "False"}
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
                <svg  height="20" width="20">
                    <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill={this.props.data["activated"] ? "green" : "red"}
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

class Campaign extends React.Component {
    // Once MainView is set up, there will be no state, but rather each will be a prop
    constructor(props){
        super(props);
        this.state = {
            campaign: {},
            result: 0,
            total: 0,
            sampleSize: 100,
            showReactionSample: false,
            traitMax: 3,
        };
    }

    /**
     * Resets the budget such that every resource is allocated 0%.
     * Used when component mounts and upon onClick of a button
     */
    resetBudget = () => {
        let proposal = {};
        // resources.forEach((resource) => {
        //     proposal[resource] = 0;
        // });
        this.setState({
            campaign: proposal,
            total: 0,
            result: 0,
            sampleSize: 100,
        });
    };

    componentDidMount() {
        // for a given list of options set each value in budget proposal to 0
        this.resetBudget();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.campaign !== this.state.campaign) {
            this.setState({
                result: this.countSupporters(),
            });
        }
    }

    handleOnClick = (e, resource) => {
        const newProposal = this.state.campaign;
        let checkBox = e.target.checked;
        let newTotal = this.state.total;

        if (checkBox === true){
            newProposal[resource] = 100;
            newTotal += 1;
        } else {
            newProposal[resource] = 0;
            newTotal -= 1;
        }
        this.setState({
            campaign: newProposal,
            total: newTotal,
            result: this.countSupporters(),
        });

    };

    // /**
    //  * Handles when the slider changes by changing the state of what the maximum values should
    //  * be for each category and updates the number of supporters and the budget proposal as a
    //  * whole
    //  * @param e The event that is triggered, use e.target.value to get the value of the slider
    //  * @param resource Tells which resource the slider belongs to so that it updates the budget
    //  * correctly
    //  */
    // handleSliderOnChange = (e, resource) => {
    //     const newVal = parseFloat(e.target.value);
    //     const newProposal = this.state.budgetProposal;
    //     let oldVal = newProposal[resource];
    //     if (this.state.total + newVal - oldVal <= 100 ){
    //         newProposal[resource] = newVal;
    //         this.setState({
    //             budgetProposal: newProposal,
    //             total: this.state.total + newVal - oldVal,
    //             result: this.countSupporters(),
    //         });
    //     }
    // };

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
            Object.keys(this.state.campaign).forEach((resource) => {
                let proposal = this.state.campaign[resource];
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
        const budgetOptions = Object.keys(this.state.campaign).map((resource, key) => (
            <div key={key} className="individual_checkbox_containers">
                <p className="campaign_descriptor">
                    {(this.state.campaign[resource]).toFixed(0)} huh based on
                    <strong> {resource} </strong>
                </p>
                <input
                    className="checkbox"
                    type="checkbox"
                    value={this.state.campaign[resource] + ""}
                    onChange={(e) => this.handleOnClick(e, resource)}
                    disabled={
                        this.state.total >= this.state.traitMax
                        && !this.state.campaign[resource]
                    }
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

                <div className="support_string">
                    {supportString}
                </div>
                <div className="reset_button">
                    <button
                        type={"submit"}
                        onClick={this.resetBudget}
                    > Reset </button>
                </div>
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

Campaign.propTypes = {
    population: PropTypes.array,
    country_name: PropTypes.string,
};

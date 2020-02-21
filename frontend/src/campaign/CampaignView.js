import React from 'react';
// import * as PropTypes from 'prop-types';

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
            </>
        );
    }
}

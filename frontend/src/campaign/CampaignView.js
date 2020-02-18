import React from 'react';
// import * as PropTypes from 'prop-types';

export class CampaignView extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            budgetData: null,
        };
    }

    /**
     * When this component is mounted to the DOM, get democracy score data from the server
     */
    async componentDidMount() {
        try {
            const res = await fetch('/api/campaign_info/');
            const budgetData = await res.json();
            this.setState({
                budgetData: JSON.parse(budgetData),
            });
        } catch (e) {
            console.log(e);
        }
    }


    render() {
        if (!this.state.budgetData) {
            return (<div>Loading!</div>);
        }
        return (
            <>
                <h1>Campaign Game</h1><hr/>
            </>
        );
    }
}

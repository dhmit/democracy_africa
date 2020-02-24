/**
 *  A container component that renders the design system,
 *  and every application, so we can look for design inconsistencies.
 */

import React from 'react';
// import * as PropTypes from 'prop-types';

import 'bootstrap/dist/css/bootstrap.min.css';

import { MapQuiz } from '../mapQuiz/mapQuiz.js';
import { EthnolinguisticCampaign } from '../ethnolinguisticCampaign/ethnolinguisticCampaign.js';
import { BudgetVotingSimViz } from '../budgetSimulation/budgetSimulation.js';
import { DemocracyViz } from '../democracyViz/democracyViz.js';
import { EdXView } from "./components";

export class AllView extends React.Component {
    render() {
        return (
            <>
                <EdXView
                    app={<MapQuiz />}
                    title="Map Quiz"
                />
                <EdXView
                    app={<BudgetVotingSimViz />}
                    title="Budget Voting Simulation"
                />
                <EdXView
                    app={<DemocracyViz />}
                    title="Democracy Visualization"
                />
                <EdXView
                    app={<EthnolinguisticCampaign />}
                    title="Ethnolinguistic Campaign Simulation"
                />
            </>
        );
    }
}



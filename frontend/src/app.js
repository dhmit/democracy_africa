/*
 * The entrypoint for our application:
 * This module gets loaded into the DOM, and then it loads everything else.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { IndexView } from './index/index.js';
import { MapQuiz } from './mapQuiz/mapQuiz.js';
import { BudgetVotingSimViz } from './budgetSimulation/budgetSimulation.js';
import { DemocracyViz } from './democracyViz/democracyViz.js';

// Import all styles
import './styles.scss';

window.app_modules = {
    React,  // Make React accessible from the base template
    ReactDOM,  // Make ReactDOM accessible from the base template

    // Add all frontend views here
    IndexView,
    MapQuiz,
    BudgetVotingSimViz,
    DemocracyViz,
};

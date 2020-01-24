import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { MapQuizD3 } from './map_quiz/map_quiz_d3.js';
import { MapQuizSVG } from './map_quiz/map_quiz_svg.js';
import MainView from './simulation/simulation.js';
import { DemocracyViz } from './heat_map/democracy_viz.js';

window.app_modules = {
    React,  // Make React accessible from the base template
    ReactDOM,  // Make ReactDOM accessible from the base template

    // Add all frontend views here
    MapQuizD3,
    MapQuizSVG,
    MainView,
    DemocracyViz,
};

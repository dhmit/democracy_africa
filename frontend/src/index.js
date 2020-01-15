import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { MapQuizLeaflet } from './map_quiz/map_quiz_leaflet.js';
import { MapQuizD3 } from './map_quiz/map_quiz_d3.js';
import { MapQuizSVG } from './map_quiz/map_quiz_svg.js';

window.app_modules = {
    React,  // Make React accessible from the base template
    ReactDOM,  // Make ReactDOM accessible from the base template

    // Add all frontend views here
    MapQuizLeaflet,
    MapQuizD3,
    MapQuizSVG,
};

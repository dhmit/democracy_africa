import React from 'react';
// import PropTypes from 'prop-types';

/**
 * Main component for the simulation.
 *
 * Handles all logic, displays information, and makes database query/posts
 */

const FAKE_PEOPLE = [
    {
        "name": "person0",
        "traits": {
            "lives_in_rural_area": true,
            "has_access_to_electricity": false,
            "has_access_to_water": true,
            "has_access_to_sanitation": false,
            "is_educated": true,
        },
        "will_support": false,
    },
    {
        "name": "person1",
        "traits": {
            "lives_in_rural_area": true,
            "has_access_to_electricity": false,
            "has_access_to_water": false,
            "has_access_to_sanitation": false,
            "is_educated": true,
        },
        "will_support": false,
    },
    {
        "name": "person2",
        "traits": {
            "lives_in_rural_area": false,
            "has_access_to_electricity": false,
            "has_access_to_water": true,
            "has_access_to_sanitation": true,
            "is_educated": true,
        },
        "will_support": false,
    },
];



export class Simulation extends React.Component {
    render() {
        let data;
        // accumulate the data
        return(
            <>
                Hello World
            </>
        )
    }
}


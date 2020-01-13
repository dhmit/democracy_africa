import React from 'react';
// import PropTypes from 'prop-types';  // uncomment once something has props!

import { getCookie } from '../common'
import './main.css';


/**
 * Main component for the student view.
 *
 * Handles all logic, displays information, and makes database query/posts
 */
class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hello_world: 'Hello, world!',
        };
        this.csrftoken = getCookie('csrftoken');
    }

    render() {
        return (
            <div>{this.state.hello_world}</div>
        );
    }
}

export default MainView;

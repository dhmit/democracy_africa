import React from 'react';
// import * as PropTypes from 'prop-types';
// import { IntroView } from './introView.js';


/**
 * Component for displaying choose your own adventure skeleton
 */

export class ChooseAdventureView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'intro',
        };
    }

    render() {

        return (
            <div>
                {this.state.view === 'intro' && "hello"}
            </div>
        );

    }
}

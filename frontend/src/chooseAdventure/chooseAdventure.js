import React from 'react';
// import * as PropTypes from 'prop-types';
import IntroView from './introView.js';
import StageView from './stageView.js';

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
                {this.state.view === 'intro' && <IntroView />}
                {this.state.view === 'stage' && <StageView />}
                <button onClick={() => this.setState({ view: 'stage'})}> Get started </button>
            </div>
        );

    }
}

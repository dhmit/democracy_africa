import React from 'react';
import IntroView from './introView.js';
import StageView from './stageView.js';
// import * as PropTypes from 'prop-types';

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
                {this.state.view === 'intro' && <IntroView desc={"helloaklsdjfhlasdkjhfkashdlf"}/>}
                {this.state.view === 'stage' && <StageView stageName={"START_STAGE"}/>}
                <button onClick={() => this.setState({ view: 'stage'})}> Get started </button>
            </div>
        );

    }
}

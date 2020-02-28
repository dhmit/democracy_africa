import React from 'react';
import IntroView from './introView.js';
import StageView from './stageView.js';
// import * as PropTypes from 'prop-types';


const INITIAL_DATA = {

};

// TODO: hardcode data structure here

const START_STAGE = {
    'text': 'Your school district\'s budget was cut!',
    'options': [{
        'text': 'Start a media campaign',
        'stageName': 'MEDIA_STAGE',
    },
    {
        'text': 'Take direct action',
        'stageName': 'DIRECT_STAGE',
    }],
};

const MEDIA_STAGE = {
    'text': 'You chose to start a media campaign.',
    'options': [{
        'text': 'Twitter',
    },
    {
        'text': 'Facebook',
    },
    {
        'text': 'Radio',
    }],
};

const DIRECT_STAGE = {
    'text': 'You chose to take direct action against the school.',
    'options': [{
        'text': 'Sue the principal',
    },
    {
        'text': 'Ask the principal nicely',
    }],
};

const NAME_TO_STAGE = {
    'START_STAGE' : START_STAGE,
    'MEDIA_STAGE' : MEDIA_STAGE,
    'DIRECT_STAGE' : DIRECT_STAGE
};

//TODO use this so that we can get rid of the nolint
// eslint-disable-next-line no-unused-vars
function getStageFromOption(option) {
    return NAME_TO_STAGE[option.stageName];
}

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

    componentDidMount() {
        // do your fetch and set initial state
        this.setState(
            INITIAL_DATA,
        );
    }

    render() {
        return (
            <div>
                {this.state.view === 'intro' && <IntroView desc={"helloaklsdjfhlasdkjhfkashdlf"}/>}
                {this.state.view === 'stage' && <StageView />}
                <button onClick={() => this.setState({ view: 'stage'})}> Get started </button>
            </div>
        );

    }
}

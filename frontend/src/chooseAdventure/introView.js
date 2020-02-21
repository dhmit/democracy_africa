import React from 'react';
// import * as PropTypes from 'prop-types';

// TODO: hardcode data structure here

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

const START_STAGE = {
    'text': 'Your school district\'s budget was cut!',
    'options': [{
        'text': 'Start a media campaign',
        'stage': MEDIA_STAGE,
    },
    {
        'text': 'Take direct action',
        'stage': DIRECT_STAGE,
    }],
};


/**
 * Component for displaying choose your own adventure skeleton
 */

class IntroView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: START_STAGE,
        };
    }

    render() {
        return ( <div>hello</div> );

    }
}

export default IntroView

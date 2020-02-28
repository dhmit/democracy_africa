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
        const desc = 'example paragraph: Paragraphs are the building blocks of papers. Many ' +
            'students ' +
            'define paragraphs in terms of length: a paragraph is a group of at least five ' +
            'sentences, ' +
            'a paragraph is half a page long, etc. In reality, though, the unity and coherence ' +
            'of ' +
            'ideas among sentences is what constitutes a paragraph. A paragraph is defined as ' +
            '“a ' +
            'group of sentences or a single sentence that forms a unit” (Lunsford and Connors ' +
            '116). ' +
            'Length and appearance do not determine whether a section in a paper is a paragraph. ' +
            'For instance, in some styles of writing, particularly journalistic styles, a ' +
            'paragraph ' +
            'can be just one sentence long. Ultimately, a paragraph is a sentence or group of ' +
            'sentences that support one main idea. In this handout, we will refer to this as the ' +
            '“controlling idea,” because it controls what happens in the rest of the paragraph.';
        return (
            <div>
                {this.state.view === 'intro' && <IntroView desc={desc}/>}
                {this.state.view === 'stage' && <StageView stageName={"START_STAGE"}/>}
                <button onClick={() => this.setState({ view: 'stage'})}> Get started </button>
            </div>
        );

    }
}

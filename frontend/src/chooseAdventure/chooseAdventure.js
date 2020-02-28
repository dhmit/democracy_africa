import React from 'react';
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
            history: [],
        };
    }

    componentDidMount() {
        // do your fetch and set initial state
    }

    setView = (view) => {
        this.setState({ view: view });
    };

    updateHistory = (option) => {
        const history = this.state.history.slice();
        history.append(option);
        this.setState({history});
    };

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
                {this.state.view === 'intro' && <IntroView desc={desc} setView={this.setView}/>}
                {this.state.view === 'stage' && <StageView stageName={"START_STAGE"}
                    updateHistory={this.updateHistory}/>}
            </div>
        );

    }
}

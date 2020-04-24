import React from 'react';
import IntroView from './introView.js';
import StageView from './stageView.js';
import EndView from './endView.js';


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
        this.setState((prevState) => ({
            history: prevState.history.concat(option),
        }));
    };

    resetProgress = () => {
        this.setState({
            history: [],
        });
    };


    render() {
        return (
            <div>
                {this.state.view === 'intro' && <IntroView
                    setView={this.setView}
                    imgFile={'/static/img/sample.jpg'}
                    altText={'sample image'}
                />}
                {this.state.view === 'stage' && <StageView
                    setView={this.setView}
                    updateHistory={this.updateHistory}
                    imgFile={'/static/img/sample.jpg'}
                />}
                {this.state.view === 'end' && <EndView
                    history={this.state.history}
                    setView={this.setView}
                    resetProgress={this.resetProgress}
                />}
            </div>
        );
    }
}

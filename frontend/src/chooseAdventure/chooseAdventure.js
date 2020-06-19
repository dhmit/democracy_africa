import React from 'react';
import IntroView from './introView.js';
import StageView from './stageView.js';
import EndView from './endView.js';
import AdventureSelector from './adventureSelector';
import { adventures } from './adventures';


/**
 * Component for displaying choose your own adventure skeleton
 */
export class ChooseAdventureView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'adventureSelector',
            history: [],
            adventure: Object.keys(adventures)[0],
        };
    }

    setAdventure = (adventure) => {
        this.setState({ adventure: adventure });
    };

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

    tryNewAdventure = () => {
        this.setState({
            view: 'adventureSelector',
            history: [],
            adventure: Object.keys(adventures)[0],
        });
    };

    render() {
        switch (this.state.view) {
        case 'adventureSelector':
            return (<AdventureSelector
                options={Object.keys(adventures)}
                setAdventure={this.setAdventure}
                setView={this.setView}
            />);
        case 'intro':
            return (<IntroView
                introDescriptions={adventures[this.state.adventure].intro}
                setView={this.setView}
            />);
        case 'stage':
            return (<StageView
                NAME_TO_STAGE={adventures[this.state.adventure].NAME_TO_STAGE}
                setView={this.setView}
                updateHistory={this.updateHistory}
            />);
        case 'end':
            return (<EndView
                endDescriptions={adventures[this.state.adventure].end}
                history={this.state.history}
                setView={this.setView}
                resetProgress={this.resetProgress}
                tryNewAdventure={this.tryNewAdventure}
            />);
        default:
            return (<>Loading...</>);
        }
    }
}

import React from 'react';
import PropTypes from 'prop-types';

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
            adventure: this.props.adventure,
        };
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
        console.log(this.state);
        switch (this.state.view) {
        case 'intro':
            return (<IntroView
                introDescriptions={this.state.adventure.intro}
                setView={this.setView}
                buttonStyle='cyoa-button'
            />);
        case 'stage':
            return (<StageView
                NAME_TO_STAGE={this.state.adventure.NAME_TO_STAGE}
                setView={this.setView}
                updateHistory={this.updateHistory}
            />);
        case 'end':
            return (<EndView
                endDescriptions={this.state.adventure.end}
                history={this.state.history}
                setView={this.setView}
                resetProgress={this.resetProgress}
            />);
        default:
            return (<>Loading...</>);
        }
    }
}
ChooseAdventureView.propTypes = {
    adventure: PropTypes.object,
};

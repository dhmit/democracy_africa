import React from 'react';
import IntroView from './introView.js';
import QuizView from './quizView.js';
import EndView from './endView.js';


/**
 * Component for displaying choose your own adventure skeleton
 */
export class DemocracyViz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'intro',
            history: [],
            successTotal: 1,
        };
    }

    componentDidMount() {
        // do your fetch and set initial state
    }

    setView = (view) => {
        this.setState({ view: view, });
    };

    updateHistory = (option) => {
        this.setState((prevState) => ({
            history: prevState.history.concat(option),
        }));
    };

    updateSuccess = (successFactor) => {
        this.setState((prevState) => ({
            successTotal: prevState.successTotal * successFactor,
        }));
    };

    resetProgress = () => {
        this.setState({
            successTotal: 1,
            history: [],
        });
    };


    render() {
        const desc = 'Introduction will go here.';
        console.log("rerendering");
        return (
            <div>
                {this.state.view === 'intro' && <IntroView desc={desc} setView={this.setView} />}
                {this.state.view === 'stage' &&
                    <QuizView setView={this.setView}
                        updateSuccess={this.updateSuccess}
                        updateHistory={this.updateHistory}
                    />}
                {this.state.view === 'end' && <EndView
                    successTotal={this.state.successTotal}
                    history={this.state.history}
                    setView={this.setView}
                    resetProgress={this.resetProgress}
                />}
            </div>
        );

    }
}

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
        const desc = <div>You are a sophomore at Rhodes University. Reports of tuition increases
            of up to 10.5% have come out from multiple South African universities, including
            Rhodes. Students at the University of Witwatersrand and the University of Cape Town
            have already begun protesting, and there are rumors floating around social media
            about a student-led total shutdown of the Rhodes Campus. Many students are worried
            that these higher fees will shut poorer students out of education. However,
            other students are worried that the disruption caused by a protest will be more
                harmful to the ability to learn.</div>;
        return (
            <div>
                {this.state.view === 'intro' && <IntroView
                    desc={desc}
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

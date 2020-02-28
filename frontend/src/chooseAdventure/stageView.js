import React from 'react';
import * as PropTypes from 'prop-types';

// TODO: hardcode data structure here, add a reference with dictionary

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

function getStageFromName(stageName) {
    return NAME_TO_STAGE[stageName];
}

/**
 * Component for displaying choose your own adventure skeleton
 */



class StageView extends React.Component {
    constructor(props) {
        super(props);
        let stage = getStageFromName(this.props.stageName);
        console.log(stage);
        this.state = {
            stage: stage,
            optionComponents: this.buildOptionComponents(stage.options)
        };
    }

    buildOptionComponents(options) {
        let optionComponents = [];
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            let component =  <Option option={option}
                setActiveStage={(stage) => this.setActiveStage(stage)}
                key={i}/>;
            optionComponents.push(component);
        }
        return optionComponents;
    }

    setActiveStage(stage) {
        this.setState({stage});
    }

    render() {
        return (
            <React.Fragment>
                <p>{this.state.stage.text}</p>
                {this.state.optionComponents}
            </React.Fragment>
        );
    }
}
StageView.propTypes = {
    stageName: PropTypes.string,
};

class Option extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let option = this.props.option;
        let text = option.text;
        let stageName = option.stageName;
        let stage = getStageFromName(stageName);
        let setActiveStage = this.props.setActiveStage;
        return (
            <button onClick={setActiveStage(stage)}>{text}</button>
        );
    }
}
Option.propTypes = {
    option: PropTypes.object,
    setActiveStage: PropTypes.func,
};

export default StageView;

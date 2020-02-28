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

const getStageFromName = (stageName) => {
    return NAME_TO_STAGE[stageName];
};

class Option extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let stage = getStageFromName(this.props.option.stageName);
        let option = this.props.option;
        return (
            <button
                onClick={() =>
                    this.props.setStage(stage, option)}
            >{this.props.option.text}</button>
        );
    }
}
Option.propTypes = {
    option: PropTypes.object,
    setStage: PropTypes.func,
};

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
        };
    }

    setStage = (stage, option) => {
        this.props.updateHistory(option);
        this.setState({ stage: stage });
    }

    render() {
        let optionComponents = <div>Loading...</div>;
        if (this.state.stage.options) {
            optionComponents = this.state.stage.options.map((option, k) =>
                <Option key={k} option={option}
                    setStage={this.setStage}
                />);
        }
        return (
            <div className={"wrapper"}>
                <p>{this.state.stage.text}</p>
                {optionComponents}
            </div>
        );
    }
}
StageView.propTypes = {
    stageName: PropTypes.string,
    updateHistory: PropTypes.func,
};

export default StageView;

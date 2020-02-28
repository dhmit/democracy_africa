import React from 'react';
import * as PropTypes from 'prop-types';

// TODO: hardcode data structure here, add a reference with dictionary

const START_STAGE = {
    'text': 'Your school district\'s budget was cut!',
    'options': [{
        'text': 'Start a media campaign',
        'stageName': 'MEDIA_STAGE',
        'successFactor': 20,
    },
    {
        'text': 'Take direct action',
        'stageName': 'DIRECT_STAGE',
        'successFactor': 10,
    }],
};

const MEDIA_STAGE = {
    'text': 'You chose to start a media campaign.',
    'options': [{
        'text': 'Twitter',
        'stageName': null,
        'successFactor': 420,
    },
    {
        'text': 'Facebook',
        'stageName': null,
        'successFactor': 0,
    },
    {
        'text': 'Radio',
        'stageName': null,
        'successFactor': 30,
    }],
};

const DIRECT_STAGE = {
    'text': 'You chose to take direct action against the school.',
    'options': [{
        'text': 'Sue the principal',
        'stageName': null,
        'successFactor': 10,
    },
    {
        'text': 'Ask the principal nicely',
        'stageName': null,
        'successFactor': 5,
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
        return (
            <button
                onClick={() =>
                    this.props.setActiveStage(this.props.option)}
            >{this.props.option.text}</button>
        );
    }
}
Option.propTypes = {
    option: PropTypes.object,
    setActiveStage: PropTypes.func,
};

/**
 * Component for displaying choose your own adventure skeleton
 */

class StageView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: getStageFromName("START_STAGE"),
        };
    }

    setActiveStage = (option) => {
        this.props.updateSuccess(option.successFactor);
        if (option.stageName) {
            this.setState({stage: getStageFromName(option.stageName)});
        } else {
            this.props.setView('end');
        }
    }

    render() {
        let optionComponents = <div>Loading...</div>;
        if (this.state.stage.options) {
            optionComponents = this.state.stage.options.map((option, k) =>
                <Option key={k} option={option}
                    setActiveStage={this.setActiveStage}
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
    setView: PropTypes.func,
    updateSuccess: PropTypes.func,
};


export default StageView;

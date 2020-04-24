import React from 'react';
import * as PropTypes from 'prop-types';

const START_STAGE = {
    'text': 'Your school district\'s budget was cut!',
    'options': [{
        'text': 'Start a media campaign',
        'stageName': 'MEDIA_STAGE',
        'successFactor': 0.9,
        'successDetail':
            'Since elections are taking place soon, it\'s good to raise awareness'
            + ' about your issue among potential voters.',
    },
    {
        'text': 'Take direct action',
        'stageName': 'DIRECT_STAGE',
        'successFactor': 0.1,
        'successDetail':
            'Unfortunately, the school officials are corrupt in your district, so '
            + 'direct action is not as effective.',
    }],
};

const MEDIA_STAGE = {
    'text': 'You chose to start a media campaign.',
    'options': [{
        'text': 'Twitter',
        'stageName': null,
        'successFactor': 0.8,
        'successDetail':
            'Twitter is huge in your country! You\'ve successfully raised awareness'
            + ' about your issue. ',
    },
    {
        'text': 'Facebook',
        'stageName': null,
        'successFactor': 0,
        'successDetail': 'Facebook is banned in your country, so most people can\'t see your'
            + ' posts.',
    },
    {
        'text': 'Radio',
        'stageName': null,
        'successFactor': 0.6,
        'successDetail': 'The people who run the most popular local radio station support your'
            + ' cause, and agree to share your message with the community.',
    }],
};

const DIRECT_STAGE = {
    'text': 'You chose to take direct action against the school.',
    'options': [{
        'text': 'Sue the principal',
        'stageName': null,
        'successFactor': 0.1,
        'successDetail': 'This was a joke filler option, it should be replaced with something'
            + ' else.',
    },
    {
        'text': 'Ask the principal nicely',
        'stageName': null,
        'successFactor': 0.5,
        'successDetail': 'The principal says no and has security escort you out.',
    }],
};

const NAME_TO_STAGE = {
    'START_STAGE': START_STAGE,
    'MEDIA_STAGE': MEDIA_STAGE,
    'DIRECT_STAGE': DIRECT_STAGE,
};

const getStageFromName = (stageName) => {
    return NAME_TO_STAGE[stageName];
};

class Option extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const stage = getStageFromName(this.props.option.stageName);
        const { option } = this.props;
        return (
            <div className='cyoa-button' onClick={() => this.props.setStage(stage, option)}>
                {this.props.option.text}
            </div>
        );
    }
}
Option.propTypes = {
    option: PropTypes.object,
    setStage: PropTypes.func,
    img_url: PropTypes.string,
};

/**
 * Component for displaying choose your own adventure skeleton
 */

class StageView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: getStageFromName('START_STAGE'),
        };
    }

    setStage = (stage, option) => {
        this.props.updateHistory(option);
        this.props.updateSuccess(option.successFactor);
        if (option.stageName) {
            this.setState({ stage: getStageFromName(option.stageName) });
        } else {
            this.props.setView('end');
        }
        this.setState({ stage: stage });
    };

    render() {
        let optionComponents = <div>Loading...</div>;
        if (this.state.stage.options) {
            optionComponents = this.state.stage.options.map((option, k) => {
                return (
                    <Option
                        key={k} option={option} setStage={this.setStage}
                    />
                );
            });
        }
        return (
            <div className={'wrapper'}>
                <div className='row'>
                    <div className={'col-6'}>
                        <p>{this.state.stage.text}</p>
                        <div className="option-selectors-list">
                            {optionComponents}
                        </div>
                    </div>
                    <img className='col-6 stage-img' src={this.props.imgFile} alt="Sample" />
                </div>

            </div>
        );
    }
}
StageView.propTypes = {
    stageName: PropTypes.string,
    updateHistory: PropTypes.func,
    setView: PropTypes.func,
    updateSuccess: PropTypes.func,
    imgFile: PropTypes.string,
};

export default StageView;

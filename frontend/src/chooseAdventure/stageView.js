import React from 'react';
import * as PropTypes from 'prop-types';
import { CaptionedImage } from '../UILibrary/components';
import { FEES_MUST_FALL_NAME_TO_STAGE as NAME_TO_STAGE } from './adventures/FeesMustFall';

class Option extends React.Component {
    render() {
        const stage = NAME_TO_STAGE[this.props.option.stageName];
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
            stage: NAME_TO_STAGE['STAGE_1'],
        };
    }

    setStage = (stage, option) => {
        this.props.updateHistory(option);
        if (option.stageName) {
            this.setState({ stage: NAME_TO_STAGE[option.stageName] });
        } else {
            this.props.setView('end');
        }
        this.setState({ stage: stage });
    };

    render() {
        const stage = this.state.stage;
        console.log(stage);

        let optionComponents = <div>Loading...</div>;
        if (stage.options) {
            optionComponents = stage.options.map((option, k) => {
                return (
                    <Option
                        key={k} option={option} setStage={this.setStage}
                    />
                );
            });
        }
        console.log(stage);
        console.log(stage.imgFile);

        return (
            <div className='wrapper'>
                <div className='row'>
                    <div className='col-6'>
                        <div>{stage.text}</div>
                        <div className="option-selectors-list">
                            {optionComponents}
                        </div>
                    </div>
                    <div className='col-6'>
                        {stage.imgFilename
                            && <CaptionedImage
                                alt={stage.imgAlt}
                                caption={stage.imgCaption}
                                filename={stage.imgFilename}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
}
StageView.propTypes = {
    stageName: PropTypes.string,
    updateHistory: PropTypes.func,
    setView: PropTypes.func,
};

export default StageView;

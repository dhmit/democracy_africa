import React from 'react';
import * as PropTypes from 'prop-types';
import { CaptionedImage } from '../UILibrary/components';
import Navbar from '../about/Navbar';

class Option extends React.Component {
    render() {
        const stage = this.props.NAME_TO_STAGE[this.props.option.stageName];
        const { option } = this.props;
        return (
            <div className='cyoa-button' onClick={() => this.props.setStage(stage, option)}>
                {this.props.option.text}
            </div>
        );
    }
}
Option.propTypes = {
    NAME_TO_STAGE: PropTypes.object,
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
            stage: this.props.NAME_TO_STAGE['STAGE_1'],
        };
    }

    setStage = (stage, option) => {
        this.props.updateHistory(option);
        if (option.stageName) {
            this.setState({ stage: this.props.NAME_TO_STAGE[option.stageName] });
        } else {
            this.props.setView('end');
        }
        this.setState({ stage: stage });
    };

    render() {
        const stage = this.state.stage;

        let optionComponents = <div>Loading...</div>;
        if (stage.options) {
            optionComponents = stage.options.map((option, k) => {
                return (
                    <Option
                        key={k}
                        option={option}
                        setStage={this.setStage}
                        NAME_TO_STAGE={this.props.NAME_TO_STAGE}
                    />
                );
            });
        }

        return (
            <div className='wrapper'>
                <Navbar currentPage='feesmustfall'/>
                <div className='row'>
                    <div className='col-sm-12 col-md-6 order-sm-0 order-md-1'>
                        {stage.imgFilename
                            && <CaptionedImage
                                alt={stage.imgAlt}
                                caption={stage.imgCaption}
                                filename={stage.imgFilename}
                            />
                        }
                    </div>
                    <div
                        className='col-sm-12 col-md-6 order-sm-1 order-md-0'
                        style={{ marginBottom: '10px' }}
                    >
                        <div>{stage.text}</div>
                        <div className="option-selectors-list">
                            {optionComponents}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
StageView.propTypes = {
    NAME_TO_STAGE: PropTypes.object,
    updateHistory: PropTypes.func,
    setView: PropTypes.func,
};

export default StageView;

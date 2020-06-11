import React from 'react';
import * as PropTypes from 'prop-types';

import { CaptionedImage } from '../UILibrary/components';


/**
 * Component for displaying choose your own adventure skeleton
 */

class IntroView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className='row'>
                    <div className='col-md-8 col-sm-12'>
                        <div>
                            {this.props.desc}
                        </div>
                        <div className='intro-btn-container'>
                            <div className='cyoa-button start-button'
                                onClick={() => this.props.setView('stage')}>
                                Get started
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 col-sm-12'>
                        <CaptionedImage
                            filename={this.props.imgFile}
                            alt={this.props.altText}
                            caption={this.props.imgCaption}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
IntroView.propTypes = {
    desc: PropTypes.object,
    setView: PropTypes.func,
    imgFile: PropTypes.string,
    imgCaption: PropTypes.object,
    altText: PropTypes.string,
};

export default IntroView;



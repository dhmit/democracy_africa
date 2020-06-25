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
        const { desc, img } = this.props.introDescriptions;
        const { imgFilename, imgAlt, imgCaption } = img;
        return (
            <div>
                <div className='row'>
                    <div
                        className='col-lg-8 col-md-12 order-12 order-lg-1'
                        style={ { marginBottom: '20px' } }
                    >
                        <div style={ { marginBottom: '40px' } }>
                            {desc}
                        </div>
                        <div className='intro-btn-container d-none d-lg-block'>
                            <div className={`${this.props.buttonStyle} start-button`}
                                onClick={() => this.props.setView('stage')}>
                                Get started
                            </div>
                        </div>
                        <div className='intro-btn-container d-block d-lg-none'>
                            <div className={`${this.props.buttonStyle} start-button w-100`}
                                onClick={() => this.props.setView('stage')}>
                                Get started
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-lg-4 col-md-12 order-1 order-lg-12'
                        style={ { textAlign: 'center' } }
                    >
                        {imgFilename
                            && <CaptionedImage
                                filename={imgFilename}
                                alt={imgAlt}
                                caption={imgCaption}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
}
IntroView.propTypes = {
    introDescriptions: PropTypes.object,
    setView: PropTypes.func,
    buttonStyle: PropTypes.string,
};

export default IntroView;



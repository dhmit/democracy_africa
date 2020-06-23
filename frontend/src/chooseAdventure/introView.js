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
                    <div className='col-lg-8 col-md-12' style={{marginBottom: '20px'}}>
                        <div>
                            {desc}
                        </div>
                        <div className='intro-btn-container'>
                            <div className='cyoa-button start-button'
                                onClick={() => this.props.setView('stage')}>
                                Get started
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4 col-md-12' style={{textAlign: 'center'}}>
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
};

export default IntroView;



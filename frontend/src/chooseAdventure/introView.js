import React from 'react';
import * as PropTypes from 'prop-types';

import { CaptionedImage } from '../UILibrary/components';
import Navbar from '../about/Navbar';


/**
 * Component for displaying choose your own adventure skeleton
 */

class IntroView extends React.Component {
    render() {
        const { desc, img } = this.props.introDescriptions;
        const { imgFilename, imgAlt, imgCaption } = img;
        return (
            <div>
                <Navbar currentPage={this.props.currentPage}/>
                <div className='row'>
                    <div
                        className='col-md-8 col-sm-12 order-12 order-md-1'
                        style={ { marginBottom: '20px' } }
                    >
                        <div style={ { marginBottom: '40px' } }>
                            {desc}
                        </div>
                        <div className='intro-btn-container d-none d-md-block'>
                            <div className={`${this.props.buttonStyle} start-button`}
                                onClick={() => this.props.setView('stage')}>
                                Get started
                            </div>
                        </div>
                        <div className='intro-btn-container d-block d-md-none'>
                            <div className={`${this.props.buttonStyle} start-button w-100`}
                                onClick={() => this.props.setView('stage')}>
                                Get started
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-4 col-sm-12 order-1 order-md-12'
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
    currentPage: PropTypes.string,
    setView: PropTypes.func,
    buttonStyle: PropTypes.string,
};

export default IntroView;



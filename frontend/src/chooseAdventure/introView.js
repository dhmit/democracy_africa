import React from 'react';
import * as PropTypes from 'prop-types';


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
                    <div className={'col-6'}>
                        {this.props.desc}
                        <div className='intro-btn-container'>
                            <div className='cyoa-button start-button'
                                onClick={() => this.props.setView('stage')}>
                                Get started
                            </div>
                        </div>
                    </div>
                    <img
                        className= 'col-6 intro-img'
                        src={this.props.imgFile}
                        alt={this.props.altText}
                        height='600'
                    />
                </div>
            </div>
        );
    }
}

IntroView.propTypes = {
    desc: PropTypes.string,
    setView: PropTypes.func,
    imgFile: PropTypes.string,
    altText: PropTypes.string,
};

export default IntroView;

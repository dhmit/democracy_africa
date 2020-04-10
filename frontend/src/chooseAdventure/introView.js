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
                    </div>
                    <img
                        className= 'col-6' src={this.props.imgFile}
                        alt='intro_image'
                        height='600'
                    />

                </div>

                <button className='col-5 cyoa-button' onClick={() => this.props.setView('stage')}>
                    Get started
                </button>
            </div>
        );
    }
}

IntroView.propTypes = {
    desc: PropTypes.string,
    setView: PropTypes.func,
    imgFile: PropTypes.string,
};

export default IntroView;

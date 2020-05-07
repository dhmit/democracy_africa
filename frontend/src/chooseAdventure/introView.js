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
        // Allow us to render any HTML in a description string
        // See: https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
        const desc_as_markup = () => { return { __html: this.props.desc }; };

        return (
            <div>
                <div className='row'>
                    <div className='col-8'>
                        <div dangerouslySetInnerHTML={desc_as_markup()} />
                        <div className='intro-btn-container'>
                            <div className='cyoa-button start-button'
                                onClick={() => this.props.setView('stage')}>
                                Get started
                            </div>
                        </div>
                    </div>
                    <img
                        className= 'col-4 intro-img img-fluid'
                        src={this.props.imgFile}
                        alt={this.props.altText}
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

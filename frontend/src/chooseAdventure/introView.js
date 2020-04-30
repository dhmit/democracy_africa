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
        const desc = <div>You are a sophomore at Rhodes University. Reports of tuition increases
                of up to 10.5% have come out from multiple South African universities, including
                Rhodes. Students at the University of Witwatersrand and the University of Cape Town
                have already begun protesting, and there are rumors floating around social media
                about a student-led total shutdown of the Rhodes Campus. Many students are worried
                that these higher fees will shut poorer students out of education. However,
                other students are worried that the disruption caused by a protest will be more
                    harmful to the ability to learn.</div>;
        return (
            <div>
                <div className='row'>
                    <div className={'col-6'}>
                        {desc}
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
                        height='400'
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

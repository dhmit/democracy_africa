import React from 'react';
import * as PropTypes from 'prop-types';

/**
 * Component for displaying choose your own adventure skeleton
 */

class EndView extends React.Component {
    constructor(props) {
        super(props);
    }

    resetAdventure = () => {
        this.props.setView('stage');
        this.props.resetProgress();
    };

    // formatAsPercentage = (probability) => {
    //     const unrounded = probability * 100;
    //     return unrounded.toFixed(0);
    // };

    render() {
        const choices = this.props.history.map((option, k) => (
            <div className={'end-option'} key={k}>
                <strong>{option.text}</strong>
                <br />
                {option.successDetail}
            </div>
        ));
        return (
            <div>
                <div>Your choices:</div>
                {choices}
                <div className='cyoa-button end-button'
                    onClick={() => this.resetAdventure()}>
                    Try again
                </div>
            </div>
        );
    }
}


EndView.propTypes = {
    setView: PropTypes.func,
    history: PropTypes.array,
    resetProgress: PropTypes.func,
};


export default EndView;

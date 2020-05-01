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
        const filteredHistory = this.props.history.filter((option) => option.showOnEnd);
        const choices = filteredHistory.map((option, k) => (
            <div className={'end-option'} key={k}>
                <strong>{option.text}</strong>
                {option.detail}
            </div>
        ));
        return (
            <div>
                <div>On October 23, 2015, President Zuma announced that there would be no tuition
                    increases in 2016. Protestors hailed this as a victory, but this announcement
                    did not spell the end of the Fallist movement. In 2016, similar rumors
                    about tuition increases started circulating, leading to the start of
                    #FeesMustFall2016.</div>
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

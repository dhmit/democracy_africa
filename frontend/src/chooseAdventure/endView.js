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

    formatAsPercentage = (probability) => {
        const unrounded = probability * 100;
        return unrounded.toFixed(2);
    };

    render() {
        const choices = this.props.history.map((option, k) => (
            <div key={k}>
                Choosing to {option.text} has
                a {this.formatAsPercentage(option.successFactor)}% chance of success.
                <br />
                {option.successDetail}
            </div>
        ));
        return (
            <div>
                <div>You had a {(this.props.successTotal * 100).toFixed(2)}%
                    chance of succeeding.</div>
                {choices}
                <button onClick={() => this.resetAdventure()}>Try again</button>
            </div>
        );
    }
}


EndView.propTypes = {
    setView: PropTypes.func,
    history: PropTypes.array,
    successTotal: PropTypes.number,
    resetProgress: PropTypes.func,
};


export default EndView;

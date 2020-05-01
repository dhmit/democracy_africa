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
        return unrounded.toFixed(0);
    };

    render() {
        const desc = 'On October 23, 2015, President Zuma announced that there would be no'
            + ' tuition increases in 2016. Protestors hailed this as a victory, but this'
            + ' announcement did not lead to the end of the Fallist movement. In 2016, similar'
            + ' rumors about tuition increases started '
            + 'circulating, leading to the start of #FeesMustFall2016.';
        const choices = this.props.history.map((option, k) => (
            <div className={'end-option'} key={k}>
                <strong>{option.text}</strong>
                <br />
                This option has a {this.formatAsPercentage(option.successFactor)}%
                 chance of success.
                <br />
                {option.successDetail}
            </div>
        ));
        return (
            <div>
                <div>{desc}</div>
                <div>You had a {this.formatAsPercentage(this.props.successTotal)}%
                    chance of succeeding.</div>
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
    successTotal: PropTypes.number,
    resetProgress: PropTypes.func,
};


export default EndView;

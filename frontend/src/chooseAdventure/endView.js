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

    render() {
        const choices = this.props.history.map((option, k) => (
            <p key={k}>Choosing {option.text} increased success by {option.successFactor}</p>
        ));
        return (
            <div>
                <div>Your success total was {this.props.successTotal}</div>
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

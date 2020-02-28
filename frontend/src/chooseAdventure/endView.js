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
        this.props.resetHistory();
        this.props.resetSuccess();
    };

    render() {
        return (
            <div>
                <div>Your success total was {this.props.successTotal}</div>
                <button onClick={() => this.resetAdventure()}>Try again</button>
            </div>
        );
    }
}

EndView.propTypes = {
    setView: PropTypes.func,
    resetSuccess: PropTypes.func,
    successTotal: PropTypes.number,
    resetHistory: PropTypes.func,
};


export default EndView;

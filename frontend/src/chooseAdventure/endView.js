import React from 'react';
import * as PropTypes from 'prop-types';

/**
 * Component for displaying choose your own adventure skeleton
 */

class EndView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div>Your success total was {this.props.successTotal}</div>
            </div>

        );

    }
}

EndView.propTypes = {
    successTotal: PropTypes.number,
};


export default EndView;

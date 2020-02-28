import React from 'react';
import * as PropTypes from "prop-types";
// import * as PropTypes from 'prop-types';


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
                <div>{this.props.desc}</div>
                <button onClick={() => this.props.setView('stage')}> Get started</button>
            </div>

        );

    }
}

IntroView.propTypes = {
    desc: PropTypes.string,
    setView: PropTypes.func,
};

export default IntroView;

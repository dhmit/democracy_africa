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
        return ( <div>{this.props.desc}</div> );

    }
}

IntroView.propTypes = {
    desc: PropTypes.string,
};

export default IntroView;

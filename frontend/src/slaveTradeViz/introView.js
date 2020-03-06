import React from 'react';
import * as PropTypes from "prop-types";
// import * as PropTypes from 'prop-types';


/**
 * Component for displaying choose your own adventure skeleton
 */

export class IntroView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div>{this.props.desc}</div>
            </div>

        );
    }
}
IntroView.propTypes = {
    desc: PropTypes.string,

};

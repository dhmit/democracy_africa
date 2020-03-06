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
            <>
                <h1>{this.props.gameName}</h1>
                <p>{this.props.aboutGame}</p>
                <hr />
                <h6>{this.props.directions}</h6>
                <br />

            </>

        );
    }
}
IntroView.propTypes = {
    gameName: PropTypes.string,
    aboutGame: PropTypes.string,
    directions: PropTypes.string,

};

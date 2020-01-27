import React from "react";
import PropTypes from "prop-types";

export class MapPath extends React.Component {
    render() {
        return (
            <path
                d={this.props.path}
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.props.fill}
                id={this.props.id}
                onMouseOver={this.props.handle_country_mouseover}
            />
        );
    }
}
MapPath.propTypes = {
    path: PropTypes.string,
    id: PropTypes.string,
    fill: PropTypes.string,
    handle_country_mouseover: PropTypes.func,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.string,
};

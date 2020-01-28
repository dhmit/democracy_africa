import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

export class MapPath extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fill: this.props.fill,
        };
        this.path_ref = React.createRef();
    }

    shouldComponentUpdate(nextProps) {
        /**
         *  Explanation of d3 transition in React:
         *  - Since constructor is only called when a component is created, this.state.fill
         *  will be set to the initial color
         *  - When the year changes, MapPath gets new props in this function in the parameter
         *  nextProps. However, this.state.fill is still the previous color because constructor has
         *  already been called when the component was created
         *  - Use d3 to select this MapPath element and apply transition
         *  - Once the transition is over, set this.state.fill to the new color
         */
        d3.select(this.path_ref.current)
            .transition()
            .duration(1000)
            .attr("fill", () => {
                return nextProps.fill;
            })
            .on("end", () => {
                this.setState({x: nextProps.fill});
            });
        return true;
    }

    render() {
        return (
            <path
                d={this.props.path}
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.state.fill}
                id={this.props.id}
                onMouseOver={this.props.handle_country_mouseover}
                ref={this.path_ref}
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

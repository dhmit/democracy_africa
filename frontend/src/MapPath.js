import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

export class MapPath extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fill: this.props.fill,
            useColorTransition: this.props.useColorTransition,
        };
        this.path_ref = React.createRef();
    }

    componentDidUpdate(prevProps) {
        /**
         *  Explanation of d3 transition in React:
         *  - Since constructor is only called when a component is created, this.state.fill
         *  will be set to the initial color
         *  - When the year changes, MapPath gets new props from this.props. However,
         *  this.state.fill is still the previous color because the constructor is only called once
         *  - Use d3 to select this MapPath element and apply transition
         *  - Once the transition is over, set this.state.fill to the new color
         */

        if (prevProps.fill !== this.props.fill) {
            if (this.state.useColorTransition) {
                d3.select(this.path_ref.current)
                    .transition()
                    .duration(1000)
                    .attr("fill", () => {
                        return this.props.fill;
                    })
                    .on("end", () => {
                        this.setState({fill: this.props.fill});
                    });
            }
            else {
                this.setState({fill: this.props.fill});
            }
        }
        console.log(this.props.handle_country_mouseover);
    }

    render() {
        return (
            <path
                d={this.props.path}
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.state.fill}
                id={this.props.id}
                onMouseOver={(e) => this.props.handle_country_mouseover(e, this.props.id)}
                onMouseOut={() => this.props.handle_country_mouseout()}
                onMouseMove={(e) => this.props.handle_country_mouseover(e, this.props.id)}
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
    handle_country_mouseout: PropTypes.func,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.string,
    useColorTransition: PropTypes.bool,
};

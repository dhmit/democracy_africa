import React from 'react';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import * as PropTypes from 'prop-types';

// NOTE(ra): this is a person icon path that I just bounced out of Illustrator and am hardcoding
// here for expediency. We should really put this in an SVG file and get it into the project
// in a more reasonable way!
// eslint-disable-next-line
const person_icon_path = 'M437.02,330.98c-27.883-27.882-61.071-48.523-97.281-61.018C378.521,243.251,404,198.548,404,148 C404,66.393,337.607,0,256,0S108,66.393,108,148c0,50.548,25.479,95.251,64.262,121.962 c-36.21,12.495-69.398,33.136-97.281,61.018C26.629,379.333,0,443.62,0,512h40c0-119.103,96.897-216,216-216s216,96.897,216,216 h40C512,443.62,485.371,379.333,437.02,330.98z M256,256c-59.551,0-108-48.448-108-108S196.449,40,256,40 c59.551,0,108,48.448,108,108S315.551,256,256,256z';


/**
 * Component for displaying citizen information
 *
 * The fill indicates the citizen's stance on the budget,
 * and hovering over the component displays the citizen's traits
 */
class Citizen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    render() {
        const description = (
            <Popover id='popover-basic'>
                <Popover.Title>
                    {this.props.title}
                </Popover.Title>
                <Popover.Content>
                    {this.props.generateDescription(this.props.data)}
                </Popover.Content>
            </Popover>
        );
        return (
            <OverlayTrigger
                overlay={description}
                placement='right'
            >
                <svg
                    className='citizen'
                    height='20'
                    width='20'
                    viewBox="0 0 512 512"
                    fill={this.props.data.will_support ? '#5abf5a' : '#db5653'}
                >
                    <path d={person_icon_path}/>
                </svg>
            </OverlayTrigger>
        );
    }
}
Citizen.propTypes = {
    data: PropTypes.object,
    title: PropTypes.string,
    generateDescription: PropTypes.func,
};

export default Citizen;

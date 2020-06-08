import React from 'react';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import * as PropTypes from 'prop-types';

// NOTE(ra): this is a person icon path that I just bounced out of Illustrator and am hardcoding
// here for expediency. We should really put this in an SVG file and get it into the project
// in a more reasonable way!
// eslint-disable-next-line max-len
const PERSON_ICON_PATH = 'M0 458 c1 -59 84 -171 137 -184 l22 -6 -26 -34 c-51 -67 -40 -151 27\n'
    + '-208 38 -31 115 -36 160 -9 72 42 89 148 37 217 l-26 34 22 6 c26 6 93 69 112\n'
    + '105 7 14 17 43 23 64 l10 37 -249 0 -249 0 0 -22z';

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
                    <path d={PERSON_ICON_PATH}/>
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

import React from 'react';
import PropTypes from 'prop-types';

import Token from './Token';
import Chip from './Chip';

const Component = ({ title, children }) => (
    <div >
        <Chip label={title} />
        <br />
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginBottom: '3rem',
                marginTop: '1rem',
            }}
        >
            {children}
        </div>
    </div>
);

Component.propTypes = {
    title: PropTypes.string,
    children: PropTypes.object,
};

const Forms = () => (
    <Token
        id="forms"
        title="Forms"
    >
        <p>
            We extend <a href="https://react-bootstrap.github.io/components/forms/">React bootstrap&apos;s forms</a> for our use cases with the interactive components.
        </p>

        <Component title="Slider">
            <div>
                <input type="range" />
            </div>
        </Component>
    </Token>
);


export default Forms;

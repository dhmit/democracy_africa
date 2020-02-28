import React from 'react';
import PropTypes from 'prop-types';
import Chip from './Chip';

import Token from './Token';


const ColorList = ({ title, children }) => (
    <div
        style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
        }}
    >
        <Chip label={title} />
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

ColorList.propTypes = {
    title: PropTypes.string,
    children: PropTypes.array,
};


const Color = ({ name }) => (
    <div
        style={{
            marginBottom: '2em',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            width: '280px',
        }}
    >
        <label className="overline" style={{
            display: 'block',
            width: '100%',
            padding: '0.5em',
            textAlign: 'center',
        }}>
            {name}
        </label>
        <div
            style={{
                borderRadius: '100%',
                border: '1px solid #eee',
                height: '5em',
                width: '5em',
            }}
            className={`colors-${name}`}
        />
    </div>
);

Color.propTypes = {
    name: PropTypes.string,
};

const Colors = () => (
    <Token
        id="colors"
        title="Colors"
        description=""
    >
        <p>
          Review variables in <a href="https://github.com/edx/edx-bootstrap/blob/master/scss/edx/_variables.scss#L6">color system</a>.
        </p>
        <ColorList
            title="Base Colors"
        >
            <Color name="white" />
            <Color name="gray-100" />
            <Color name="gray-200" />
            <Color name="gray-300" />
            <Color name="gray-400" />
            <Color name="gray-500" />
            <Color name="gray-600" />
            <Color name="gray-700" />
            <Color name="gray-800" />
            <Color name="gray-900" />
            <Color name="black" />
        </ColorList>
        <ColorList
            title="Brand Colors"
        >
            <Color name="blue" />
            <Color name="dark-blue" />
            <Color name="indigo" />
            <Color name="red" />
            <Color name="yellow" />
            <Color name="green" />
            <Color name="slate" />
            <Color name="magenta" />
        </ColorList>
        <ColorList
            title="Background only Colors"
        >
            <Color name="pale-gray" />
            <Color name="pale-blue" />
            <Color name="pale-yellow" />
            <Color name="light-green" />
            <Color name="light-blue" />
            <Color name="light-red" />
            <Color name="light-yellow" />
        </ColorList>
    </Token>
);


export default Colors;

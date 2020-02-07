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
        <ColorList
            title="Base Colors"
        >
            <Color name="black" />
            <Color name="white" />
            <Color name="red" />
            <Color name="color_grey_50" />
            <Color name="color_grey_100" />
            <Color name="color_grey_200" />
            <Color name="color_grey_300" />
            <Color name="color_grey_400" />
            <Color name="color_grey_500" />
            <Color name="color_grey_600" />
            <Color name="color_grey_700" />
            <Color name="color_grey_800" />
            <Color name="color_grey_900" />
        </ColorList>
        <ColorList
            title="Brand Colors"
        >
            <Color name="color_primary_50" />
            <Color name="color_primary_100" />
            <Color name="color_primary_200" />
            <Color name="color_primary_300" />
            <Color name="color_primary_400" />
            <Color name="color_primary_500" />
            <Color name="color_primary_600" />
            <Color name="color_primary_700" />
            <Color name="color_primary_800" />
            <Color name="color_primary_900" />
        </ColorList>
    </Token>
);


export default Colors;

import React from 'react';
import PropTypes from 'prop-types';

const Chip = ({ label }) => (
    <div className="-chip -chip-material-ui--shim">
        <label>
            {label}
        </label>
    </div>

);

Chip.propTypes = {
    label: PropTypes.string,
};


export default Chip;

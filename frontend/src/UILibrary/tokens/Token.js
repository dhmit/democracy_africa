import React from "react";
import PropTypes from "prop-types";

function Token({
    title,
    description,
    children,
}) {
    return (
        <div
            style={{
                marginBottom: '4em',
                marginTop: '2em',
            }}
        >
            <h2>{title}</h2>

            {description &&
            <p style={{ marginBottom: "1em", marginTop: "1em", maxWidth: "40vw" }}>
                {description}
            </p>
            }

            <div>
                {children}
            </div>

            <br />
        </div>
    );
}

Token.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.node,
};

export default Token;

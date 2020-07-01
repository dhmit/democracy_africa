import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../about/Navbar';

class AdventureSelector extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="adventure-selector">
                <Navbar currentPage='adventure'/>
                <h1>Welcome to Choose Your Own Adventure!</h1>
                <p>Which adventure would you like to embark on today?</p>
                <select onChange={(e) => this.props.setAdventure(e.target.value)}>
                    {this.props.options.map((option, k) => {
                        return (
                            <option key={k}>
                                {option}
                            </option>
                        );
                    })}
                </select>
                <br/>
                <button className="cyoa-button" onClick={() => this.props.setView('intro')}>
                    Start Adventure
                </button>
            </div>
        );
    }
}
AdventureSelector.propTypes = {
    options: PropTypes.array,
    setAdventure: PropTypes.func,
    setView: PropTypes.func,
};

export default AdventureSelector;

import React from 'react';
import * as PropTypes from 'prop-types';
import { COUNTRIES } from './speech';

class CountrySelectorPopup extends React.Component {
    selectCountryClosePopup = (country) => {
        this.props.changeCountry(country);
        this.props.closePopup(true);
    };

    render() {
        return (
            <div className="background">
                <div className='country-selector'>
                    <div className="country-header">
                        <span className="country-title">Select a country</span>
                        <span
                            className="close close-button"
                            onClick={() => this.props.closePopup(false)}
                        >
                            &times;
                        </span>
                    </div>
                    <div className='row w-100 country-options'>
                        {COUNTRIES.map((country, key) => (
                            <div key={key} className='col-lg-4 col-md-12'>
                                <div className='card' style={{ marginBottom: '15px' }}>
                                    <div className='card-header'>
                                        <h5>{country.name}</h5>
                                    </div>
                                    <div className='card-body'>
                                        <table className='table'><tbody>
                                            <tr>
                                                <td>Population</td>
                                                <td>{country.population}</td>
                                            </tr>
                                            <tr>
                                                <td>Difficulty</td>
                                                <td>{country.difficulty}</td>
                                            </tr>
                                        </tbody></table>
                                    </div>
                                    <button
                                        className='country-button'
                                        onClick={() => this.selectCountryClosePopup(country.name)}
                                    >Start</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        );
    }
}
CountrySelectorPopup.propTypes = {
    changeCountry: PropTypes.func,
    closePopup: PropTypes.func,
};

export default CountrySelectorPopup;

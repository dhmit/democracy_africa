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
            <div className='country-selector'>
                <div className="modal-header country-header">
                    <h3 className="country-title">Select a country</h3>
                    <span
                        className="close close-button"
                        onClick={() => this.props.closePopup(false)}
                    >
                        &times;
                    </span>
                </div>
                <div className='row w-100'>
                    {COUNTRIES.map((country, key) => (
                        <div key={key} className='col-sm-12 col-md-4'>
                            <div className='card' >
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
                                    onClick={() => this.selectCountryClosePopup(country.name)}
                                >Start</button>
                            </div>
                        </div>
                    ))}
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

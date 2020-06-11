import React from 'react';
import * as PropTypes from 'prop-types';
import { COUNTRIES } from './speech';

class CountrySelectorPopup extends React.Component {
    selectCountryClosePopup = (country) => {
        this.props.changeCountry(country);
        this.props.closePopup();
    };

    render() {
        return (
            <div className='country-selector'>
                <h3>Select a country</h3>
                <div className='row w-100'>
                    {COUNTRIES.map((country, key) => (
                        <div key={key} className='col-lg-4 col-md-12'>
                            <div className='card' style={{marginBottom: '10px'}}>
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

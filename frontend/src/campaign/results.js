import React from 'react';
import * as PropTypes from 'prop-types';
import Citizen from './citizen';

class Results extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const resultsData = this.props.provinceData;
        if (!resultsData) {
            return (<></>);
        }

        const sample = [];
        Object.keys(this.props.provinceData).forEach((province) => {
            const provinceData = this.props.provinceData[province];
            if (province === this.props.clickedProvince || this.props.clickedProvince === '') {
                const citizens = provinceData['citizens'];
                sample.push(...citizens.slice(0, Math.round(citizens.length * 0.25)));
            }
        });
        const citizens = sample.map((citizen, k) => (
            <Citizen
                key={k}
                data={citizen}
                title={`Citizen of ${citizen['province']}`}
                generateDescription={this.props.generateDescription}
            />
        ));

        const countryPercent = Math.round((this.props.countryData.totalSupport
                                                / this.props.countryData.totalPopulation) * 100);

        const winText = 'Congratulations! You got a majority of the electorate.';
        const loseText = 'Sadly, you were unable to get a majority of the electorate.';
        return (
            <div>
                <p className={'resultHeader'}>
                    {countryPercent >= 50 ? winText : loseText}
                </p>
                <table className={'resultTable'}>
                    <tbody>
                        <tr>
                            <th>Province Name</th>
                            <th>Number of Supporters</th>
                            <th>Number of People</th>
                            <th>Percentage of Votes</th>
                        </tr>
                        {Object.keys(resultsData).map((province, k) => {
                            if (province !== 'countryTotal'
                                && province !== 'countrySupporters'
                                && province !== 'countryName') {
                                const supporters = resultsData[province].totalSupporters;
                                const total = resultsData[province].citizens.length;
                                const percentage = Math.round((supporters / total) * 100);
                                return (
                                    <tr
                                        key={k}
                                    >
                                        <td className="table-provinces">
                                            {province}
                                        </td>
                                        <td>{supporters}</td>
                                        <td>{total}</td>
                                        <td>
                                            <span className={percentage >= 50
                                                ? 'support'
                                                : 'unsupport'}
                                            >
                                                {percentage}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            }
                            return (<></>);
                        })}
                        <tr className={'countryResult'}>
                            <th>{this.props.countryName}</th>
                            <th>{this.props.countryData.totalSupport}</th>
                            <th>{this.props.countryData.totalPopulation}</th>
                            <th>
                                <span
                                    className={`${countryPercent >= 50
                                        ? 'support'
                                        : 'unsupport'}`}
                                >
                                    {Math.round((this.props.countryData.totalSupport
                                                / this.props.countryData.totalPopulation) * 100)}%
                                </span>
                            </th>
                        </tr>
                    </tbody>
                </table>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-lg-6">
                            {this.props.map}
                        </div>


                        <div className='result-population col-lg-6 col-md-12'>
                            <div className='result-population_header'>
                                Results for sample population of size {sample.length}
                            </div>
                            <div className='result-population_svg'>
                                {citizens}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
Results.propTypes = {
    provinceData: PropTypes.object,
    countryData: PropTypes.object,
    countryName: PropTypes.string,
    mapData: PropTypes.array,
    generateDescription: PropTypes.func,
    map: PropTypes.object,
    clickedProvince: PropTypes.string,
    handleProvinceMapClick: PropTypes.func,
};

export default Results;

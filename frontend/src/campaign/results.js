import React from 'react';
import * as PropTypes from 'prop-types';
import { MapPath } from '../UILibrary/components';
import Citizen from './citizen';

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.map_height = 500;
        this.map_width = 500;
    }

    render() {
        const resultsData = this.props.provinceData;
        if (!resultsData) {
            return (<></>);
        }

        // TODO: possibly refactor this further since it is similar to CampaignView
        const sample = [];
        Object.values(this.props.provinceData).forEach((province) => {
            const citizens = province['citizens'];
            sample.push(...citizens.slice(0, Math.round(citizens.length * 0.25)));
        });
        const citizens = sample.map((citizen, k) => (
            <Citizen
                key={k}
                data={citizen}
                title={`Citizen of ${citizen['province']}`}
                generateDescription={this.props.generateDescription}
            />
        ));

        return (
            <div>
                <table border='1' className={'resultTable'}>
                    <tbody>
                        <tr>
                            <th>Province Name</th>
                            <th>Number of Supporters</th>
                            <th>Number of People</th>
                            <th>Percentage of Votes</th>
                        </tr>
                        {Object.keys(resultsData).map((province, k) => (
                            (
                                province !== 'countryTotal'
                                && province !== 'countrySupporters'
                                && province !== 'countryName'
                            )
                            && <tr key={k}>
                                <td>{province}</td>
                                <td>{resultsData[province].totalSupporters}</td>
                                <td>{resultsData[province].citizens.length}</td>
                                <td>{Math.round((resultsData[province].totalSupporters
                                    / resultsData[province].citizens.length) * 100)}%</td>
                            </tr>
                        ))}
                        <tr className={'countryResult'}>
                            <th>{this.props.countryName}</th>
                            <th>{this.props.countryData.totalSupport}</th>
                            <th>{this.props.countryData.totalPopulation}</th>
                            <th>{Math.round((this.props.countryData.totalSupport
                                                / this.props.countryData.totalPopulation) * 100)}%
                            </th>
                        </tr>
                    </tbody>
                </table>
                <div className="container">
                    <div className="row">
                        <svg
                            height={this.map_height}
                            width={this.map_width}
                            id='content'
                            className='result-map col-md-12 col-lg-6'
                        >
                            {this.props.mapData.map((province, i) => {
                                let countryFill;
                                if (province.name) {
                                    countryFill = resultsData[province.name].totalSupporters
                                    / resultsData[province.name].citizens.length > 0.5
                                        ? '#5abf5a' : '#db5653';
                                } else {
                                    countryFill = '#F6F4D2';
                                }

                                return <MapPath
                                    key={i}
                                    path={province.svg_path}
                                    id={province.postal}
                                    fill={countryFill}
                                    stroke='black'
                                    strokeWidth='1'
                                    useColorTransition={false}
                                />;
                            })}
                        </svg>
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
};

export default Results;

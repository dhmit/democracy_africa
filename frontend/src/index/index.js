/*
 * The landing page for the site.
 */

import React from 'react';
import * as PropTypes from 'prop-types';

export class IndexView extends React.Component {
    render() {
        return (
            <>
                <h1>Democracy and Development: Perspectives from Africa</h1>
                <IndexCard
                    url='/map_quiz/'
                    title='Africa Map Quiz'
                    description='
                        Learn the names of all the countries in Africa.
                        Put your score up on the board.
                    '
                />

                <IndexCard
                    url='/budget_voting_simulation/'
                    title='Budget Simulator'
                    description='
                        Try to make a budget that meets the needs of the most citizens.
                    '
                />

                <IndexCard
                    url='/heat_map/'
                    title='Electoral Democracy Scores'
                    description='
                        Learn how indices measuring electoral democracy in Africa change over time.
                    '
                />
            </>
        );
    }
}

class IndexCard extends React.Component {
    render() {
        return (
            <div className='card mb-4'>
                <div className='card-header'>
                    <a
                        className="btn btn-primary mr-4"
                        href={this.props.url}
                    >{this.props.title}</a>
                </div>
                <div className='card-body'>
                    {this.props.description}
                </div>
            </div>
        );
    }
}
IndexCard.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
};
/*
 * The landing page for the prototyping environment.
 *
 * PLEASE NOTE: this is not going to go into the EdX course.
 * It's just for our convenience while developing,
 * so DO NOT spend too much time making this nice!
 */

import React from 'react';
import * as PropTypes from 'prop-types';

export class IndexView extends React.Component {
    render() {
        return (
            <>
                <h1 className="mb-4">
                    Gamifying Democracy and Development:<br/> Perspectives from Africa
                </h1>

                <div className="row">
                    <div className="col-12 col-sm-6">
                        <IndexCard
                            url='/adventure/'
                            title='#FeesMustFall'
                            description='
                                Take the role of a student during the 2015-16
                                #FeelsMustFall movement in South Africa.'
                        />
                    </div>
                    <div className="col-12 col-sm-6">
                        <IndexCard
                            url='/campaign_game/'
                            title='Campaign Game'
                            description='Make a speech to try and get people to vote for you.'
                        />
                    </div>
                </div>

                <h3>Prototypes</h3>
                <div className="row">
                    <div className="col-12 col-sm-4 d-flex align-items-stretch">
                        <IndexCard
                            url='/map_quiz/'
                            title='Africa Map Quiz'
                            description='
                                        Learn the names of all the countries in Africa.
                                        Put your score up on the board.
                                    '
                        />
                    </div>
                    <div className="col-12 col-sm-4 d-flex align-items-stretch">
                        <IndexCard
                            url='/heat_map/'
                            title='Electoral Democracy Scores'
                            description='
                        Learn how indices measuring electoral democracy in Africa change over time.
                    '
                        />
                    </div>

                    <div className="col-12 col-sm-4 d-flex align-items-stretch">
                        <IndexCard
                            url='/budget_voting_simulation/'
                            title='Budget Simulator'
                            description='
                                Try to make a budget that meets the needs of the most citizens.
                            '
                        />
                    </div>
                </div>

                <h3>Quick links</h3>
                <ul>
                    <li>
                        <a href="https://www.edx.org/course/democracy-and-development-perspectives-from-afri-2">
                            The course on edX: Democracy and Development: Perspectives from Africa
                        </a>
                    </li>

                    <li>
                        <a href="https://docs.google.com/document/d/1k5J-yIODumamCIt0DdmvV-ISXFxIVRvQpVubuP0KPqU/edit">
                            Brainstorming Doc
                        </a>
                    </li>

                    <li>
                        <a href="https://docs.google.com/document/d/1k5J-yIODumamCIt0DdmvV-ISXFxIVRvQpVubuP0KPqU/edit">
                            Brainstorming Doc
                        </a>
                    </li>

                    <li>
                        <a href="https://drive.google.com/drive/folders/1EfQKscfSVw9GlMRiJ1N3B66COrKMo6e1?usp=sharing">
                            Google Drive folder
                        </a>
                    </li>
                </ul>

            </>
        );
    }
}

class IndexCard extends React.Component {
    render() {
        const createMarkup = () => {
            return { __html: this.props.description };
        };

        return (
            <div className='card mb-4'>
                <div className='card-header'>
                    <a
                        className="btn btn-primary mr-4"
                        href={this.props.url}
                    >{this.props.title}</a>
                </div>
                <div
                    className='card-body'
                    dangerouslySetInnerHTML={createMarkup()}
                />
            </div>
        );
    }
}
IndexCard.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
};

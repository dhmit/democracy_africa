/*
 * The landing page for the prototyping environment.
 *
 * PLEASE NOTE: this is not going to go into the EdX course.
 * It's just for our convenience while developing,
 * so DO NOT spend too much time making this nice!
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import Navbar from '../about/Navbar';

export class IndexView extends React.Component {
    render() {
        return (
            <div className='landing-page'>
                <Navbar/>
                <div className="landing-title">
                    Gamifying Democracy and Development:<br/> Perspectives from Africa
                </div>
                <div className="row" >
                    <img
                        className='col-lg-6 col-md-12'
                        src='/static/img/man_voting.jpg'
                        alt='A South African man voting.'
                    />
                    <div className='landing-text col-lg-6 col-md-12'>
                        Have you ever taken an online course only to find that you feel
                        disengaged after taking the same types of quizzes over and over again? Don't
                        you wish that there was a more interactive way to explore the course
                        material? We might have the solution for you! By creating simulations
                        and gamifying various aspects of democratic life in Africa, we show how it
                        is possible to make learning with edX fun.
                    </div>
                </div>
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
                        <a href="https://drive.google.com/drive/folders/1EfQKscfSVw9GlMRiJ1N3B66COrKMo6e1?usp=sharing">
                            Google Drive folder
                        </a>
                    </li>
                </ul>
                <h3>About these Projects</h3>
                <div className="row">
                    <div className="col-12">
                        These projects are part of the MIT Programs in Digital Humanities, funded
                        by the Andrew W. Mellon
                        Foundation, a collaboration between the staff and students of the MIT DH
                        Lab and Professor Evan Lieberman, Total Professor of Political Science and
                        Contemporary Africa at MIT and the DH Faculty Fellow for Spring 2020.
                    </div>
                </div>
            </div>
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

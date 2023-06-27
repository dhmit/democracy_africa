/*
 * The landing page for the prototyping environment.
 *
 * PLEASE NOTE: this is not going to go into the EdX course.
 * It's just for our convenience while developing,
 * so DO NOT spend too much time making this nice!
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import Navbar from '../about/Navbar';
import { CaptionedImage, Footer } from '../UILibrary/components';

export class IndexView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        };
    }

    render() {
        const handleClose = () => this.setState({show: false});

        return (<>
            <Modal show={this.state.show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Archived Copy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    "Democracy and Development: Perspectives from Africa” was a project by the <a href = "https://digitalhumanities.mit.edu/">MIT Programs in Digital Humanities</a> in collaboration with our Spring 2020 Faculty Fellow, <a href = "https://polisci.mit.edu/people/evan-lieberman">Evan Lieberman</a>, Total Professor of Political Science and Contemporary Africa at MIT. The project has been archived, and is no longer being actively maintained.
                    <br/><br/>
                    The project contains student work, and there may be features which are incomplete or inaccurate
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className='landing-page'>
                <Navbar/>
                <div className="row" >
                    <div className='col-lg-6 col-md-12'>
                        <CaptionedImage
                            alt='A voter in Ghana casting his ballot.'
                            caption='A voter in Ghana casting his ballot.'
                            filename='man_voting.jpg'
                        />
                    </div>
                    <div className='landing-text mt-4 mt-lg-0 col-lg-6 col-md-12'>
                        <div className='row'>
                            <div className='col col-lg-12'>
                                <IndexCard
                                    url='/feesmustfall/'
                                    title='#FeesMustFall'
                                    description='
                                    Take the role of a student during the 2015-16
                                    #FeesMustFall movement in South Africa.'
                                />
                            </div>
                            <div className='col col-lg-12'>
                                <IndexCard
                                    url='/campaign_game/'
                                    title='Campaign Game'
                                    description='Take on the role of a politician setting policy
                                    proposals based on survey data from constitutents.
                                    '
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <h3>Prototypes</h3>
                <div className="row">
                    <div className="col-12 col-lg-6 d-flex align-items-stretch">
                        <IndexCard
                            url='/map_quiz/'
                            title='Africa Map Quiz'
                            description='Learn the names of all the countries in Africa.'
                        />
                    </div>
                    <div className="col-12 col-lg-6 d-flex align-items-stretch">
                        <IndexCard
                            url='/heat_map/'
                            title='Electoral Democracy Scores'
                            description='
                        Learn how indices measuring electoral democracy in Africa change over time.
                    '
                        />
                    </div>

                    <div className="col-12 col-lg-6 d-flex align-items-stretch">
                        <IndexCard
                            url='/budget_voting_simulation/'
                            title='Budget Simulator'
                            description='
                                Try to make a budget that meets the needs of the most citizens.
                            '
                        />
                    </div>
                    <div className="col-12 col-lg-6 d-flex align-items-stretch">
                        <IndexCard
                            url='/sample/'
                            title='Sample Adventure'
                            description='
                                A template interactive fiction to show how our infrastructure
                                for #FeesMustFall could be used to create other interactive
                                narratives
                            '
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </>);
    }
}

class IndexCard extends React.Component {
    render() {
        const createMarkup = () => {
            return { __html: this.props.description };
        };

        return (
            <div className='card mb-4 w-100'>
                <a className="text-dark" href={this.props.url}>
                    <div className='card-header'>{this.props.title} </div>
                </a>
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

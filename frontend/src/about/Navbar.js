import React, { Component } from 'react';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNav: false,
        };
    }

    render() {
        return (
            <div>
                <div className='about-nav'>
                    <div className='d-sm-block d-none'>
                        <a className='nav-title' href='/'>
                            Democracy And Development: Perspectives From Africa
                        </a>
                    </div>
                    <div className='d-block d-sm-none'>
                        <a className='nav-title-small' href='/'>
                            Democracy And Development: Perspectives From Africa
                        </a>
                    </div>
                    <div className='d-none d-lg-block ml-auto'>
                        <a className='about-nav-link' href='/campaign_game/'>Campaign Simulation</a>
                        <a className='about-nav-link' href='/feesmustfall/'>
                            #FeesMustFall
                        </a>
                        <a className='about-nav-link' href='/about/'>About</a>
                    </div>
                    <div
                        className="hamburger d-block d-lg-none"
                        onClick={() => { this.setState({ showNav: !this.state.showNav }); }}
                    >
                        <div className="rectangle"/>
                        <div className="rectangle"/>
                        <div className="rectangle"/>
                    </div>
                </div>
                {
                    this.state.showNav
                    && <div className='alternate-nav d-block d-lg-none'>
                        <a className='alternate-link' href='/'>Home</a>
                        <a className='alternate-link' href='/campaign_game/'>Campaign Simulation</a>
                        <a className='alternate-link' href='/adventure/'>
                            Choose Your Own Adventure
                        </a>
                        <a className='alternate-link' href='/about/'>About</a>
                    </div>
                }
            </div>
        );
    }
}

export default Navbar;

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
                    <div className='nav-title d-sm-block d-none'>
                        Democracy And Development Perspectives From Africa
                    </div>
                    <div className='nav-title-small d-block d-sm-none'>
                        Democracy And Development Perspectives From Africa
                    </div>
                    <div className='d-none d-lg-block'>
                        <a className='about-nav-link' href='/'>Home</a>
                        <a className='about-nav-link' href='/campaign_game/'>Campaign Game</a>
                        <a className='about-nav-link' href='/adventure/'>
                            Choose Your Own Adventure
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
                        <a className='alternate-link' href='/campaign_game/'>Campaign Game</a>
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

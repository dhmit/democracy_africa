/**
 *  Components that are reused frequently throughout the project
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import * as d3 from 'd3';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBook,
    faChevronRight,
    faChevronLeft,
    faFilm,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Component used to render paths into SVGs
 */
export class MapPath extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fill: this.props.fill,
        };
        this.path_ref = React.createRef();
    }

    componentDidUpdate(prevProps) {
        /**
         *  Explanation of d3 transition in React:
         *  - Since constructor is only called when a component is created, this.state.fill
         *  will be set to the initial color
         *  - When the year changes, MapPath gets new props from this.props. However,
         *  this.state.fill is still the previous color because the constructor is only called once
         *  - Use d3 to select this MapPath element and apply transition
         *  - Once the transition is over, set this.state.fill to the new color
         */

        if (prevProps.fill !== this.props.fill) {
            if (this.props.useColorTransition) {
                d3.select(this.path_ref.current)
                    .transition()
                    .duration(500)
                    .attr('fill', () => {
                        return this.props.fill;
                    })
                    .on('end', () => {
                        this.setState({ fill: this.props.fill });
                    });
            } else {
                this.setState({ fill: this.props.fill });
            }
        }
    }

    render() {
        return (
            <path
                d={this.props.path}
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                fill={this.state.fill}
                id={this.props.id}
                onMouseOver={this.props.handle_country_mouseover}
                onClick={this.props.handle_country_click}
                ref={this.path_ref}
            />
        );
    }
}
MapPath.propTypes = {
    path: PropTypes.string,
    id: PropTypes.string,
    fill: PropTypes.string,
    handle_country_mouseover: PropTypes.func,
    handle_country_click: PropTypes.func,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.string,
    useColorTransition: PropTypes.bool,
};


export class CaptionedImage extends React.Component {
    render() {
        return (
            <figure className="figure w-100">
                <img
                    className='figure-img img-fluid w-100'
                    src={'/static/img/' + this.props.filename}
                    alt={this.props.alt}
                />
                <figcaption className="figure-caption" style={ { textAlign: 'left' } }>
                    {this.props.caption}
                </figcaption>
            </figure>

        );
    }
}
CaptionedImage.propTypes = {
    filename: PropTypes.string,
    caption: PropTypes.object,
    alt: PropTypes.string,
};



export class EdXView extends React.Component {
    render() {
        return (
            <section className='edx-course-content'>
                <header className='edx-page-header'>
                    <a>Course</a>
                    &gt; <a>Module 2: Module Description</a>
                    &gt; <a>Section of the Module</a>
                    &gt; {this.props.title}
                </header>
                <main className='edx-app-main'>
                    <div className='text-center'>
                        <nav className='edx-sequence-nav'>
                            <button>
                                <FontAwesomeIcon icon={faChevronLeft} /> Previous
                            </button>
                            <button>
                                <FontAwesomeIcon icon={faFilm} />
                            </button>
                            <button className='edx-sequence-nav-active-button'>
                                <FontAwesomeIcon icon={faBook} />
                            </button>
                            <button>
                                Next <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </nav>
                    </div>
                    {this.props.app}
                    <div className='text-center bottom-buttons'>
                        <nav className='edx-sequence-nav'>
                            <button className='ml-auto'>
                                <FontAwesomeIcon icon={faChevronLeft} /> Previous
                            </button>
                            <button className='mr-auto'>
                                Next <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </nav>
                    </div>
                </main>
                <Footer/>
            </section>
        );
    }
}
EdXView.propTypes = {
    app: PropTypes.element,
    title: PropTypes.string,
};




export class Footer extends React.Component {
    render() {
        return (
            <footer className="footer bg-white text-dark text-center mt-auto">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-4 py-3">
                            <a href="https://digitalhumanities.mit.edu/">
                                <img
                                    src="/static/img/dh_logo.svg"
                                    className='footer-img'
                                    alt='Digital Humanities at MIT Logo'
                                />
                            </a>
                        </div>
                        <div className="col-4 py-3">
                            <a href="https://www.mit.edu/">
                                <img
                                    src="/static/img/mit_logo.svg"
                                    className='footer-img'
                                    alt='MIT Logo'
                                />
                            </a>
                        </div>
                        <div className="col-4 py-3">
                            <a href="https://www.mellon.org/">
                                <img
                                    src="/static/img/mellon_logo.svg"
                                    className='footer-img'
                                    alt="Mellon Foundation Logo"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

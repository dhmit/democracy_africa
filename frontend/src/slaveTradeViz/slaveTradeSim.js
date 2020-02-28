import React from 'react';
//import * as PropTypes from 'prop-types';
import { IntroView } from './introView';
import { SlaveTradeViz } from './slaveTradeViz.js';


/**
 * Component for displaying choose your own adventure skeleton
 */
export class SlaveTradeSim extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'intro',
        };
    }

    componentDidMount() {
        // do your fetch and set initial state
    }

    setView = (view) => {
        this.setState({view: view,});
    };

    render() {
        return (
            <div>
                {this.state.view === 'intro' && (
                    <>
                        <IntroView desc={'gygygygy'} />
                        <button
                            onClick={() => this.setState({view: 'main'})}
                        > Get started</button>
                    </>
                )}
                {this.state.view === 'main' && <SlaveTradeViz />}

            </div>
        );
    }
}


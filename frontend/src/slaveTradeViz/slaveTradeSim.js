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
                        <IntroView gameName={'Visualization of Slave Trade and Interpersonal' +
                        ' Trust'} aboutGame={'Lorem ipsum' +
                        'dolor sit amet, consectetur adipiscing elit. Donec pellentesque ' +
                        'magna efficitur metus tempus venenatis. Proin nisl erat, venenatis ' +
                        'id maximus commodo, maximus vel leo. In maximus turpis eget lorem ' +
                        'maximus, in blandit est lacinia. Nam at tellus elementum, maximus ' +
                        'ante vel, luctus odio. Nullam placerat interdum eros ac ornare. Morbi' +
                        ' sagittis, mauris at auctor bibendum, ipsum tellus faucibus sapien,' +
                        ' quis dapibus risus nulla eget dui. Quisque eget tristique lorem, nec' +
                        ' dapibus nisl. Vestibulum ante ipsum primis in faucibus orci luctus et' +
                        'ultrices posuere cubilia Curae; Donec vitae risus augue. Ut vitae ' +
                        'suscipit sapien. Suspendisse sollicitudin malesuada ultricies.'}
                        directions={'Directions: Lorem ipsumdolor sit amet, consectetur ' +
                        'adipiscing elit. Donec pellentesque magna efficitur metus tempus' +
                        ' venenatis.'} />
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


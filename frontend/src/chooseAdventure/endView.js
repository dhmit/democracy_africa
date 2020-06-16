import React from 'react';
import * as PropTypes from 'prop-types';
import { CaptionedImage } from '../UILibrary/components';

/**
 * Component for displaying choose your own adventure skeleton
 */

class EndView extends React.Component {
    constructor(props) {
        super(props);
    }

    resetAdventure = () => {
        this.props.setView('stage');
        this.props.resetProgress();
    };

    // formatAsPercentage = (probability) => {
    //     const unrounded = probability * 100;
    //     return unrounded.toFixed(0);
    // };

    render() {
        const filteredHistory = this.props.history.filter((option) => option.showOnEnd);
        const choices = filteredHistory.map((option, k) => (
            <div className={'end-option'} key={k}>
                <strong>{option.text}</strong>
                {option.endDetail}
            </div>
        ));


        const imgFilename = 'FMF_demonstration_1.jpg';
        const imgCaption = (<>
            Photo credit:&nbsp;
            <a href="https://search.creativecommons.org/photos/62c80a30-6066-40e7-badc-a6a637099d05" title="via Wikimedia Commons">
                tony4carr
            </a> / <a href="https://creativecommons.org/licenses/by-nc/2.0">CC BY-NC</a>
        </>);
        const imgAlt = 'Student protesters during the #FeesMustFall movement';


        return (<>
            <div className="row">
                <div className="text-center col my-auto">
                    <CaptionedImage
                        filename={imgFilename}
                        alt={imgAlt}
                        caption={imgCaption}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <p>
                        On 23 October, 2015, South African President Zuma announced that there would
                        be <a href="https://www.bbc.com/news/world-africa-34618724">
                        no tuition increases</a> in 2016.
                    </p>
                    <p>
                        Protesters hailed this as a victory, but this announcement did not spell
                        the end of the Fallist movement.
                    </p>
                    <p>
                        In 2016, similar rumors about tuition increases started circulating,
                        leading to the start of #FeesMustFall2016. Overall, the protests cost
                        about 800 million South African rand (42 million <small>USD</small>)
                        in damage.
                    </p>
                    <p>
                        Here is additional information about the&nbsp;
                        <a href="https://en.wikipedia.org/wiki/FeesMustFall">
                            #FeesMustFall
                        </a>
                        &nbsp;movement.
                    </p>
                </div>
                <div className="col-6">
                    <div>You chose to:</div>
                    {choices}
                </div>
            </div>
            <div className='row' >
                <button
                    className='cyoa-button end-button'
                    onClick={() => this.resetAdventure()}
                >
                    Try again
                </button>
            </div>
        </>);
    }
}


EndView.propTypes = {
    setView: PropTypes.func,
    history: PropTypes.array,
    resetProgress: PropTypes.func,
};


export default EndView;

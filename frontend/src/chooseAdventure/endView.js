import React from 'react';
import * as PropTypes from 'prop-types';
import { CaptionedImage } from '../UILibrary/components';
import Navbar from '../about/Navbar';

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

    render() {
        const filteredHistory = this.props.history.filter((option) => option.showOnEnd);
        const choices = filteredHistory.map((option, k) => (
            <div className={'end-option'} key={k}>
                <strong>{option.text}</strong>
                {option.endDetail}
            </div>
        ));
        const { desc, img } = this.props.endDescriptions;
        const { imgFilename, imgAlt, imgCaption } = img;

        return (<>
            <Navbar/>
            {imgFilename
                && <div className="row">
                    <div className="text-center col my-auto">
                        <CaptionedImage
                            filename={imgFilename}
                            alt={imgAlt}
                            caption={imgCaption}
                        />
                    </div>
                </div>
            }
            <div className="row">
                <div className="col-md-12 col-lg-6">
                    {this.props.history.map((option) => {
                        return option.additionalDetail;
                    })}
                    {desc}
                </div>
                <div className="col-md-12 col-lg-6">
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
    endDescriptions: PropTypes.object,
    setView: PropTypes.func,
    history: PropTypes.array,
    resetProgress: PropTypes.func,
};


export default EndView;

import React, { Component } from 'react';
import { ChooseAdventureView } from './chooseAdventure';
import { feesMustFallAdventure } from './adventures/FeesMustFall';

class FeesMustFallView extends Component {
    render() {
        return (
            <ChooseAdventureView adventure={feesMustFallAdventure}/>
        );
    }
}

export default FeesMustFallView;

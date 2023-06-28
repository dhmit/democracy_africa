import React, { Component } from 'react';
import { ChooseAdventureView } from './chooseAdventure';
import { sampleAdventure } from './adventures/Sample';

class SampleView extends Component {
    render() {
        return (
            <ChooseAdventureView adventure={sampleAdventure}/>
        );
    }
}

export default SampleView;

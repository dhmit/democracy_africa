import React from 'react';
import ReactDOM from 'react-dom';
import { MapQuiz } from './mapQuiz';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MapQuiz />, div);
    ReactDOM.unmountComponentAtNode(div);
});

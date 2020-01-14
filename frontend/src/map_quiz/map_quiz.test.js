import React from 'react';
import ReactDOM from 'react-dom';
import MapQuizD3 from './map_quiz_d3';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MapQuizD3 />, div);
    ReactDOM.unmountComponentAtNode(div);
});

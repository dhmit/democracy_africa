import React from 'react';
import ReactDOM from 'react-dom';
import { map_quiz_svg } from './mapQuiz';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<map_quiz_svg />, div);
    ReactDOM.unmountComponentAtNode(div);
});

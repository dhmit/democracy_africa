import React from 'react';

import Colors from './tokens/Colors';
import Typography from './tokens/Typography';
import Forms from './tokens/Forms';


const System = () => (
    <div style={{ margin: '2em' }}>
        <h1>DHLab UI Library</h1>

        <p style={{ marginBottom: "1em", marginTop: "1em"}}>
            A collection of all the components that make the DHLab <a href="/">Prespectives from
            Africa Library</a>. We leverage <a href="https://getbootstrap.com/" target="_blank" rel="noopener noreferrer">
                Bootstrap
            </a> and the <a href="https://react-bootstrap.github.io/" target="_blank" rel="noopener noreferrer">
                the React Bootstrap library</a>.
            Make sure to try to use components you see here — this will keep our user
            experience and code consistent.
        </p>
        <p>
            <strong>Check out <a href="https://react-bootstrap.github.io/components/alerts/">React Bootstrap components</a> for the big picture when you&apos;re getting started</strong>.
        </p>
        <p>
            We don&apos;t make use of all the components in the React library. Either because
            we didn&apos;t yet find the use case, and sometimes because some of them
            aren&apos;t so great, so please check here for our Officially Supported Components™.
            This library will grow over time and you&apos;re free to suggest additions and
            changes over in the <a href="https://app.slack.com/client/TCLM42YA0/CCLTGQHJ6">#general</a> Slack channel. But, please don&apos;t go yolo-adding
            random React components into the codebase that&apos;ll end up siloed and a pain to
            deal with later. All components that we use in the main codebase
            need to be documented here. If you have any design or development questions,
            holla at a staff member on Slack.
        </p>

        <Colors />
        <Typography />
        <Forms />
    </div>
);

export default System;

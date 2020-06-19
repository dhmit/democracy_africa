import React from 'react';

const sample_img_props = {
    'imgFilename': 'sample.jpg',
    'imgAlt': 'Sample',
    'imgCaption': (<>
        Sample Image
        <br/>Photo credit:&nbsp;
        <a href="#">
            Unknown
        </a> / <a href="#">
        CC-by-sa 2.0
        </a>
    </>),
};

const STAGE_1 = {
    'text': <div>Sample Question 1?</div>,
    ...sample_img_props,
    'options': [
        {
            'text': <div>Option A</div>,
            'stageName': 'STAGE_1A',
            'endDetail': <div>Chose option A</div>,
            'showOnEnd': true,
        },
        {
            'text': <div>Option B</div>,
            'stageName': 'STAGE_1B',
            'endDetail': <div>Chose option B</div>,
            'showOnEnd': true,
        },
        {
            'text': <div>Option C</div>,
            'stageName': 'STAGE_1C',
            'endDetail': <div>Chose option C</div>,
            'showOnEnd': true,
        },
    ],
};

const STAGE_1A = {
    'text': <div>This is sample text for Option A. It has an image. </div>,
    ...sample_img_props,
    'options': [{
        'text': <div>Next</div>,
        'stageName': null,
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_1B = {
    'text': <div>This is sample text for Option B. It does not have an image.</div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': null,
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_1C = {
    'text': <div>This is sample text for Option C. It has an image.</div>,
    ...sample_img_props,
    'options': [{
        'text': <div>Next</div>,
        'stageName': null,
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const NAME_TO_STAGE = {
    'STAGE_1': STAGE_1,
    'STAGE_1A': STAGE_1A,
    'STAGE_1B': STAGE_1B,
    'STAGE_1C': STAGE_1C,
};

const introDesc = (
    <>
        <h5>
            You are going to go on a sample adventure.
        </h5>
        <p>
            This is sample text for the introduction.
        </p>
    </>
);

const endDesc = (
    <>
        This is sample text for the end.
    </>
);

const endImg = {
    imgFilename: 'sample.jpg',
    imgCaption: (
        <>
            Photo credit:&nbsp;
            <a
                href="#"
                title="Sample Image"
            >Unknown</a>
            /
            <a href="#">CC BY-SA</a>
        </>
    ),
    imgAlt: 'Sample Image',
};

const introImg = {
    imgFilename: 'sample.jpg',
    imgCaption: (
        <>
            Photo credit:&nbsp;
            <a
                href="#"
                title="Sample Image"
            >Unknown</a>
            /
            <a href="#">CC BY-SA</a>
        </>
    ),
    imgAlt: 'Sample Image',
};

export const sampleAdventure = {
    NAME_TO_STAGE: NAME_TO_STAGE,
    intro: { desc: introDesc, img: introImg },
    end: { desc: endDesc, img: endImg },
};

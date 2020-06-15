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
    'text': <div>What kind of pet do you want?</div>,
    ...sample_img_props,
    'options': [
        {
            'text': <div>Dog</div>,
            'stageName': 'STAGE_1A',
            'endDetail': 'You are now less lonely because you have a dog, one of your favorite'
                + ' animals. You spend the rest of your summer feeding the dog and teaching it'
                + ' tricks.',
            'showOnEnd': true,
        },
        {
            'text': <div>Cat</div>,
            'stageName': 'STAGE_1B_INT',
            'endDetail': 'Your neighbor is not happy about your cat because she is allergic to'
                + ' cats. At least you are not lonely. This summer, you made many fond memories'
                + ' with your cat.',
            'showOnEnd': true,
        },
        {
            'text': <div>Snake</div>,
            'stageName': 'STAGE_1C_INT',
            'endDetail': 'The snake does not seem to like its new home, but it does seem fun to'
                + ' watch it slither around. One day, the snake bites you and you cry. Maybe you'
                + ' should have gotten another pet.',
            'showOnEnd': true,
        },
    ],
};

const STAGE_1A = {
    'text': <div>You decide to get a dog. When you go to the adoption center, you see a beautiful
    corgi. You decide to adopt that dog and give it a home.</div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': null,
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_1B_INT = {
    'text': <div>
        You decide to get a cat. Upon arriving at the adoption center, a black and white cat
        stands out from the rest of the animals. You decide to adopt that cat.
    </div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': null,
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_1C_INT = {
    'text': <div>
        You went with your parents to the pet store, but couldn't find a snake. Luckily, on your way
        home, you found a snake on the sidewalk and decide to take it home.
    </div>,
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
    'STAGE_1B_INT': STAGE_1B_INT,
    'STAGE_1C_INT': STAGE_1C_INT,
};

const introDesc = (
    <>
        <h5>
        You are a child and today you want a pet.
        </h5>
        <p>
            Now that it is summertime, you feel alone at home when your parents go out to work. To
            keep you company, your parents decided that they will get you a pet.
        </p>
    </>
);

const endDesc = (
    <>
        What a great summer! You now have a friend to experience the joys of the summer together.
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

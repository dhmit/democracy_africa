import React from 'react';
import * as PropTypes from 'prop-types';
import { CaptionedImage } from '../UILibrary/components';


const rhodes_campus_img_props = {
    'imgFilename': 'FMF_0_rhodes.jpg',
    'imgAlt': 'Rhodes University Campus',
    'imgCaption': (<>
        Rhodes University Campus
        <br/>Photo credit:&nbsp;
        <a href="https://de.wikipedia.org/wiki/Datei:Rhodes_university_campus_7.jpg">
            Lysippos
        </a> / <a href="https://creativecommons.org/licenses/by-sa/2.0/">
        CC-by-sa 2.0
        </a>
    </>),
};

const jail_img_props = {
    'imgFilename': 'FMF_jail.png',
    'imgAlt': 'Student protesters in a holding cell during the #FeesMustFall movement',
    'imgCaption': (<>
        <a href="https://twitter.com/Icyboyaya/status/656895466060300288">Twitter</a>
    </>),
};

const demonstration_img_props = {
    'imgFilename': 'FMF_demonstration.jpg',
    'imgAlt': '#FeesMustFall protesters in a demonstration in Praetoria',
    'imgCaption': (<>
        Photo credit:&nbsp;
        <a href="https://search.creativecommons.org/photos/dc2c05b2-773f-410c-8273-c24fd5a4b521">
            Paul Saad
        </a> / <a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">
        CC BY-NC-ND 2.0
        </a>
    </>),
};

const violence_img_props = {
    'imgFilename': 'FMF_violence.jpg',
    'imgAlt': '#FeesMustFall protesters holding up their hands to signal they come in peace.',
    'imgCaption': (<>
        Photo credit:&nbsp;
        <a href="https://en.wikipedia.org/wiki/File:%27Do_not_shoot%27_a_group_of_students_shout.JPG">
            Myolisi
        </a> / <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA</a>
    </>),
};

const STAGE_1 = {
    'text': <div>A friend texts you about a sit-in at the administrative offices. What is your
        initial reaction?</div>,
    ...rhodes_campus_img_props,
    'options': [
        {
            'text': <div>Agree; you want to participate in the sit-in!</div>,
            'stageName': 'STAGE_1A',
            'endDetail': '',
            'showOnEnd': true,
        },
        {
            'text': <div>Agree to participate in the sit-in, but you’re a little skeptical: want to
                learn more</div>,
            'stageName': 'STAGE_1B_INT',
            'endDetail': '',
            'showOnEnd': true,
        },
        {
            'text': <div>Disagree: you’re really not comfortable being part of the sit-in right
                now</div>,
            'stageName': 'STAGE_1C_INT',
            'endDetail': '',
            'showOnEnd': true,
        },
    ],
};

const STAGE_1A = {
    'text': <div>You get there, but feel the tension of the situation. What do you want to do?
    </div>,
    'options': [{
        'text': <div> You decide to sneak out before things get worse and are worried that the
             sit-in might escalate from a purely peaceful protest because students
             started blockading road access.</div>,
        'stageName': 'STAGE_2',
        'endDetail': '',
        'showOnEnd': true,
    },
    {
        'text': <div>You stay with the movement and help block the roads. After, you join them at
             the sit in. The protesters occupy the admin building and things escalate! You try to
             escape, but get caught by the riot police.</div>,
        'stageName': 'STAGE_1AB_INT',
        'endDetail': '',
        'showOnEnd': true,
    }],
};

const STAGE_1AB_INT = {
    'text': <div>That night, students hold an all night vigil outside the police station, calling
        for your and your peers’ release. Thankfully, they let you go.</div>,
    ...jail_img_props,
    'options': [{
        'text': <div>Next</div>,
        'stageName': 'STAGE_2',
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_1B_INT = {
    'text': <div>
        <p>After you’ve had a while to ponder, you decide you want to participate, but you’d prefer
            a less confrontational route.</p>
        <p>In the meantime, the university closes anyway.</p>
        <p>On 19 October, the University agrees to new negotiations.</p>
    </div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': 'STAGE_2',
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_1C_INT = {
    'text': <div>
        <p>You’re really not comfortable being part of this right now.</p>
        <p>As you are revising for exams in the university library, groups of students come in and
            intimidate you for not being part of the cause. Some of them carry weapons, making you
            a bit uncomfortable. On Twitter, student groups accuse you for sympathizing with the
            government and not caring about the consequences of the fee increase for other students.
            In the meantime, you begin to see more and more police surrounding your campus. But you
            also start to hear about your university starting to negotiate with student
            activists.</p>
        <p>A few days later, your university closes indefinitely. You start to feel a bit bad that
            you spent those last days on campus preparing for exams rather than actively
            protesting. </p>
        <p>In the meantime, the university closes anyway.</p>
        <p>On 19 October, the University agrees to new negotiations.</p>
    </div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': 'STAGE_2_1C',
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_2 = {
    'text': <div>On 21 October, you hear about the potential march on Parliament.</div>,
    ...demonstration_img_props,
    'options': [{
        'text': <div>Join the march</div>,
        'stageName': 'STAGE_2A_INT',
        'endDetail': <div>WITS university administration announces that no disciplinary action
            will be taken against students and staff members who participated in the
            protests.</div>,
        'showOnEnd': true,
    },
    {
        'text': <div>Participate by social media</div>,
        'stageName': 'STAGE_2B_INT',
        'endDetail': '',
        'showOnEnd': true,
    },
    {
        'text': <div>Do nothing</div>,
        'stageName': 'STAGE_2C_INT',
        'endDetail': '',
        'showOnEnd': true,
    }],
};

const STAGE_2_1C = {
    'text': <div>On 21 October, you hear about the potential march on Parliament.</div>,
    ...demonstration_img_props,
    'options': [{
        'text': <div>Join the march</div>,
        'stageName': 'STAGE_2A_INT',
        'endDetail': <div>WITS university administration announces that no disciplinary action
            will be taken against students and staff members who participated in the
            protests.</div>,
        'showOnEnd': true,
    },
    {
        'text': <div>Participate by social media</div>,
        'stageName': 'STAGE_2B_INT',
        'endDetail': '',
        'showOnEnd': true,
    },
    {
        'text': <div>Still, you’re not comfortable; you again do nothing</div>,
        'stageName': 'STAGE_2C_INT',
        'endDetail': <div>You’ve remained outside the action the whole time. But you feel
            terrible that your friends have suffered. As they are released, you try to contact them,
            separately and together, but you receive no response. Perhaps you’ve been affected after
            all. </div>,
        'showOnEnd': true,
    }],
};

const STAGE_2A_INT = {
    'text': <div>
        <p>Aha. Maybe those in the government will listen. This sounds like a better opportunity
            to have an impact; you want to join this march. (Plus you feel kind of terrible that
            your friends got arrested.)</p>
        <p>Just as you are wrapping up, some people in the crowd agitate the police by throwing a
            flaming “coffin” Blade Nzimande at them, and violence breaks out.</p>
    </div>,
    ...violence_img_props,
    'options': [{
        'text': <div>Next</div>,
        'stageName': null,
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_2B_INT = {
    'text': <div>
        <p>This sounds like something others should know about! You choose to use social
        media to share what’s happening.</p>
        <p>You inform other people of the march on parliament and it turns out that as many as 5000
            people showed up to protest. You feel a mixed sense of relief and horror as you hear
            about that chaos towards the end of the march.</p>
        <p>From October 13th through November 10th 2015 over 1,270,738 Twitter tweets used this
            hashtag to show support of the protest, and if you used this hashtag, you were one of
            them!</p>
        <p>Many activist groups and students united on this topic on Twitter as it is one of the
            most prevalent issues currently. It was so much that this hashtag began trending
            worldwide on Twitter. Due to the pressure of the protests and the global pressure of
            the usage of this hashtag, many school officials sought ways to increase censorship and
            prevent protests on school and social media platforms. This was so extreme that the
            University of Cape Town even received a verdict from the High Court of South Africa to
            do so. This hashtag gave voice to many students that didn’t have any and gave these
            students the power to question the government. If there’s a way to learn about this
            from a student’s perspective, Twitter is the way to go!</p>
    </div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': null,
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_2C_INT = {
    'text': <div>
        <p>You’re skeptical any of this will work. It might be better to stay out of this for now.
            So you choose to do nothing. </p>
        <p>Given the violent end to the march, you feel satisfied with your choice to stay back.</p>
    </div>,
    'options': [{
        'text': 'Next',
        'stageName': null,
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const NAME_TO_STAGE = {
    'STAGE_1': STAGE_1,
    'STAGE_1A': STAGE_1A,
    'STAGE_1AB_INT': STAGE_1AB_INT,
    'STAGE_1B_INT': STAGE_1B_INT,
    'STAGE_1C_INT': STAGE_1C_INT,
    'STAGE_2': STAGE_2,
    'STAGE_2_1C': STAGE_2_1C,
    'STAGE_2A_INT': STAGE_2A_INT,
    'STAGE_2B_INT': STAGE_2B_INT,
    'STAGE_2C_INT': STAGE_2C_INT,
};

class Option extends React.Component {
    render() {
        const stage = NAME_TO_STAGE[this.props.option.stageName];
        const { option } = this.props;
        return (
            <div className='cyoa-button' onClick={() => this.props.setStage(stage, option)}>
                {this.props.option.text}
            </div>
        );
    }
}
Option.propTypes = {
    option: PropTypes.object,
    setStage: PropTypes.func,
    img_url: PropTypes.string,
};

/**
 * Component for displaying choose your own adventure skeleton
 */

class StageView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: NAME_TO_STAGE['STAGE_1'],
        };
    }

    setStage = (stage, option) => {
        this.props.updateHistory(option);
        if (option.stageName) {
            this.setState({ stage: NAME_TO_STAGE[option.stageName] });
        } else {
            this.props.setView('end');
        }
        this.setState({ stage: stage });
    };

    render() {
        const stage = this.state.stage;
        console.log(stage);

        let optionComponents = <div>Loading...</div>;
        if (stage.options) {
            optionComponents = stage.options.map((option, k) => {
                return (
                    <Option
                        key={k} option={option} setStage={this.setStage}
                    />
                );
            });
        }
        console.log(stage);
        console.log(stage.imgFile);

        return (
            <div className='wrapper'>
                <div className='row'>
                    <div className='col-6'>
                        <div>{stage.text}</div>
                        <div className="option-selectors-list">
                            {optionComponents}
                        </div>
                    </div>
                    <div className='col-6'>
                        {stage.imgFilename
                            && <CaptionedImage
                                alt={stage.imgAlt}
                                caption={stage.imgCaption}
                                filename={stage.imgFilename}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
}
StageView.propTypes = {
    stageName: PropTypes.string,
    updateHistory: PropTypes.func,
    setView: PropTypes.func,
};

export default StageView;

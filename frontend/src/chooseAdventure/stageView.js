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
            'text': <div>Agree; however, you’re a little skeptical about how the sit-in will be
                effective. You want to learn more about the movement.</div>,
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
        <p>You decide that you want to gain a better understanding about the current events
            surrounding the movement. How would you like to learn more?</p>
    </div>,
    'options': [{
        'text': <div>Read articles and social media posts on the Internet.</div>,
        'stageName': 'STAGE_1BA_INT',
        'endDetail': '',
        'showOnEnd': true,
    },
    {
        'text': <div>Ask your parents.</div>,
        'stageName': 'STAGE_1BB_INT',
        'endDetail': '',
        'showOnEnd': true,
    },
    {
        'text': <div>Talk to your friends and other students.</div>,
        'stageName': 'STAGE_1BC_INT',
        'endDetail': '',
        'showOnEnd': true,
    }],
};

const STAGE_1BA_INT = {
    'text': <div>
        <p>You decide to spend some time to educate yourself about the #FeesMustFall movement.
            After some research, you became even more aware of the large extent to which your
            country's higher education system is, structurally and financially, still effected
            by legacies of the apartheid eras.
        </p>
        <p>
            With this new knowledge, you understand that the time to address these issues is
            now and so you decide to go to the sit-in.
        </p>
    </div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': 'STAGE_1A',
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_1BB_INT = {
    'text': <div>
        <p>After mentioning student demonstrations like the sit-in to your family members, they
            give you some warnings about the risk of getting expelled by your school or having any
            disciplinary and criminal records that might make it more difficult for you to
            find jobs in the future.
        </p>
        <p>
            Ultimately, you decide that you will support the movement but in a less
            confrontational way.
        </p>
        <p>
            In the meantime, the university closes anyway and on the 19th of October,
            the University agrees to begin new negotiations with the students.
        </p>
    </div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': 'STAGE_2',
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_1BC_INT = {
    'text': <div>
        <p>As you leave your final class of the day, you ask your friends whether they are going
            to the sit-in. Most of them are going to oppose the increase in fees. One of the
            students mentions how their family is already having a hard time paying for tuition.
        </p>
        <p>
            After being moved by the anecdotes of your peers, you also think about how difficult it
            was for your family to gather enough money to pay for your own tuition. Allowing a
            further increase in tuition will devastate your education and your family. You decide
            to go to the sit-in to support the cause.
        </p>

    </div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': 'STAGE_1A',
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
    'text': <div>After the recent sit-in, you hear about a potential march on Parliament on the
        21st of October. What do you want to do this time?</div>,
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
    'text': <div>After the recent sit-in, you hear about a potential march on Parliament on the
        21st of October. What do you want to do this time?</div>,
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
        <p>This march sounds like something others should know about! To spread awareness about
            this event, you are going to use social media. Which social media platform do
            you want to use?</p>
    </div>,
    'options': [{
        'text': <div>Use Twitter</div>,
        'stageName': 'STAGE_2BA_INT',
        'endDetail': <div>Through Twitter, you spread awareness of the movement and the march.
            However, your retweets were not able to reach many of your peers who use other social
            media platforms. In fact, in South Africa, it was mostly the elites who used Twitter.
        </div>,
        'showOnEnd': true,
    },
    {
        'text': <div>Use WhatsApp</div>,
        'stageName': 'STAGE_2BB_INT',
        'endDetail': <div>It turns out that as many as 5000 people showed up to protest at the
            Parliament. Thanks to your help with actively inviting your friends to join the
            WhatsApp group chat, you were able to increase the number of people at the march and
            make a big statement to the education officials.
        </div>,
        'showOnEnd': true,
    },
    {
        'text': <div>Use Facebook</div>,
        'stageName': 'STAGE_2BC_INT',
        'endDetail': '',
        'showOnEnd': true,
    }],
};

const STAGE_2BA_INT = {
    'text': <div>
        <p>
            You go on Twitter and retweet some of the tweets by the student organizers of the
            #FeesMustFall movement, hoping that the logistics regarding the march at Parliament is
            spread to students who are willing and able to participate in the protests.
        </p>
        <p>
            After the day of the march, you feel a mixed sense of relief and horror as you hear
            about that chaos towards the end of the march.
        </p>
        <p>
            From October 13th through November 10th 2015 over 1,270,738 Twitter tweets used this
            hashtag to show support of the protest, and since you used this hashtag, you were one
            of the many people who helped support this movement!
        </p>
    </div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': null,
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_2BB_INT = {
    'text': <div>
        <p>
            You join the WhatsApp group chat for the #FeesMustFall movement. The student organizers
            of the group chat regularly post information relevant to the protests. You start adding
            other people you know to the group chat in order to spread information about the march
            at Parliament.
        </p>
        <p>
            Through this platform, the organizers are able to inform thousands of students both
            from your university and from other universities about the movement and events.
        </p>

    </div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': null,
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_2BC_INT = {
    'text': <div>
        <p>You message some of your old friends from high school; some of them are attending
            other universities where the movement has not started yet. You encourage them to
            gather other students from their universities and organize a group to demonstrate
            solidarity with the #FeesMustFall movement.</p>

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
    'STAGE_1BA_INT': STAGE_1BA_INT,
    'STAGE_1BB_INT': STAGE_1BB_INT,
    'STAGE_1BC_INT': STAGE_1BC_INT,
    'STAGE_2': STAGE_2,
    'STAGE_2_1C': STAGE_2_1C,
    'STAGE_2A_INT': STAGE_2A_INT,
    'STAGE_2B_INT': STAGE_2B_INT,
    'STAGE_2C_INT': STAGE_2C_INT,
    'STAGE_2BA_INT': STAGE_2BA_INT,
    'STAGE_2BB_INT': STAGE_2BB_INT,
    'STAGE_2BC_INT': STAGE_2BC_INT,
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

        return (
            <div className='wrapper'>
                <div className='row'>
                    <div className='col-sm-12 col-md-6' style={{ marginBottom: '10px' }}>
                        <div>{stage.text}</div>
                        <div className="option-selectors-list">
                            {optionComponents}
                        </div>
                    </div>
                    <div className='col-sm-12 col-md-6'>
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

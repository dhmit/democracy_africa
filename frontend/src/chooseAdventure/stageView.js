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

const library_img_props = {
    'imgFilename': 'FMF_library.jpg',
    'imgAlt': 'A student studying at the library',
    'imgCaption': (<>
        Photo credit:&nbsp;
        <a href="https://www.flickr.com/photos/70105586@N00/115691311">
            Shaine Mata
        </a> / <a href="https://creativecommons.org/licenses/by-nc/2.0/">CC BY-NC 2.0</a>
    </>),
};

const blockade_img_props = {
    'imgFilename': 'FMF_blockade.jpg',
    'imgAlt': '#FeesMustFall protesters blockade a road with a burning tire.',
    'imgCaption': (<>
        Photo credit:&nbsp;
        <a href="https://www.flickr.com/photos/70105586@N00/115691311">
            Ian Barbour
        </a> / <a href="https://creativecommons.org/licenses/by-nc-sa/2.0/">CC BY-NC-SA 2.0</a>
    </>),
};

const social_media_img_props = {
    'imgFilename': 'FMF_social_media.jpg',
    'imgAlt': 'A phone with various social media apps like Facebook, Twitter, and Whatsapp.',
    'imgCaption': (<>
        Photo credit:&nbsp;
        <a href="https://pxhere.com/en/photo/1063277">
            Unknown
        </a> / <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC BY-CC0 1.0</a>
    </>),
};

const research_img_props = {
    'imgFilename': 'FMF_research.jpg',
    'imgAlt': 'A laptop used to research about the #FeesMustFall movement.',
    'imgCaption': (<>
        Photo credit:&nbsp;
        <a href="https://pixabay.com/photos/home-office-workstation-office-336373/">
            Unknown
        </a> / <a href="https://pixabay.com/service/license/">Pixabay License</a>
    </>),
};

const friends_img_props = {
    'imgFilename': 'FMF_friends.jpg',
    'imgAlt': 'A group of friends talking with each other.',
    'imgCaption': (<>
        Photo credit:&nbsp;
        <a href="https://www.pexels.com/photo/photo-of-women-sitting-while-talking-3811108/">
            Retha Ferguson
        </a> / <a href="https://www.pexels.com/license/">Pexels License</a>
    </>),
};

const twitter_img_props = {
    'imgFilename': 'FMF_twitter.png',
    'imgAlt': 'A tweet with a picture of the increases calling out the Department of Higher'
        + ' Education and Training for being silent.',
    'imgCaption': (<>
        Photo credit:&nbsp;
        <a href="https://twitter.com/Bhut_BanoThando/status/656047187122638848">
            Twitter
        </a>
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
                effective. You want to learn more about the movement</div>,
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
    ...blockade_img_props,
    'options': [{
        'text': <div> Sneak out before things get worse. You are worried that the
             sit-in might escalate from a purely peaceful protest because students
             are starting to blockade road access.</div>,
        'stageName': 'STAGE_1AA_INT',
        'endDetail': '',
        'showOnEnd': true,
    },
    {
        'text': <div>Stay with the movement and help block the roads with burning tires</div>,
        'stageName': 'STAGE_1AB_INT',
        'endDetail': '',
        'showOnEnd': true,
    }],
};

const STAGE_1AA_INT = {
    'text': <div>
        <p>
            When you arrived home, you hear about how the sit-in had escalated, resulting in the
            arrest of many protesters. You feel a sense of relief that you were not taken to jail.
        </p>
        <p>
            In the meantime, the university closes and on the 19th of October,
            the university agrees to begin new negotiations with the students.
        </p>
    </div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': 'STAGE_2',
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_1AB_INT = {
    'text': <div>
        <p>
            After blocking the roads, you join the other protesters at the sit in and occupy
            the admin building, but that was when things started to escalate! You try to
            escape, but you get caught by the riot police.
        </p>
        <p>
            That night, students hold an all night vigil outside the police station, calling
            for the release of you and your peers. Thankfully, the police let you all go.
        </p>
    </div>,
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
        <p>You decide that you want to gain a better understanding about the movement.
            How would you like to learn more?</p>
    </div>,
    'options': [{
        'text': <div>Read articles and social media posts on the Internet</div>,
        'stageName': 'STAGE_1BA_INT',
        'endDetail': '',
        'showOnEnd': true,
    },
    {
        'text': <div>Ask your family</div>,
        'stageName': 'STAGE_1BB_INT',
        'endDetail': '',
        'showOnEnd': true,
    },
    {
        'text': <div>Talk to your friends and other students</div>,
        'stageName': 'STAGE_1BC_INT',
        'endDetail': '',
        'showOnEnd': true,
    }],
};

const STAGE_1BA_INT = {
    'text': <div>
        <p>
            You decide to spend some time educate yourself about the #FeesMustFall movement
            instead of going to the sit-in. After some research, you become even more aware of
            the large extent to which your country's higher education system is, structurally
            and financially, still affected by the legacies of the apartheid era. With this new
            knowledge, you gain a better understanding of the sentiment of the students and how
            frustrating it must feel to have a system that works against you.
        </p>
        <p>
            In the meantime, the university closes anyway and on the 19th of October, the
            university agrees to begin new negotiations with the students.
        </p>
    </div>,
    ...research_img_props,
    'options': [{
        'text': <div>Next</div>,
        'stageName': 'STAGE_2',
        'endDetail': '',
        'showOnEnd': false,
    }],
};

const STAGE_1BB_INT = {
    'text': <div>
        <p>
            After mentioning the student demonstrations like the sit-in to your family members, they
            give you some warnings. They didn't think it was worth the risk of getting expelled by
            your school or having any disciplinary and criminal records that might make it more
            difficult for you to find jobs in the future.
        </p>
        <p>
            Ultimately, you decide that you will support the movement but in a less confrontational
            way.
        </p>
        <p>
            In the meantime, the university closes anyway and on the 19th of October, the
            university agrees to begin new negotiations with the students.
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
        <p>
            As you leave your final class of the day, you ask your peers whether they are going to
            the sit-in. There are mixed responses between them. They acknowledge the importance of
            speaking out against the government when they enact unfair policies, but also see the
            danger that comes from being in the front lines of the protests, where police can
            physically harm you. After hearing the arguments made by your peers, you decide that
            you will look for other ways to support this movement.
        </p>
        <p>
            In the meantime, the university closes anyway and on the 19th of October, the university
            agrees to begin new negotiations with the students.
        </p>
    </div>,
    ...friends_img_props,
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
        <p>
            You are the first in your family to attend university. Over the past school year, you
            have been focused on getting good marks. You hope to graduate and ultimately secure a
            job. Because you have a lot of upcoming exams, you have been spending a lot of time
            reviewing in the university library. When groups of students start coming into the
            library with weapons to protest, you feel a bit intimidated. On Facebook as well
            as other social media platforms, other students accuse you for sympathizing with
            the government; they say that you don’t care enough about the consequences of the
            fee increase for other students.
        </p>
        <p>
            In the meantime, you begin to see more and more police on and surrounding your campus.
            However, you also start to hear about your university starting to negotiate with
            student activists.
        </p>
        <p>
            A few days later, your university closes indefinitely. You start to feel a bit bad
            that you spent those last days on campus preparing for exams rather than actively
            protesting. You feel guilty and a bit selfish too.
        </p>
    </div>,
    ...library_img_props,
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
        'endDetail': <div>
            You’ve remained outside the action the whole time; you feel terrible that your friends
            have suffered. When they get released, you try to contact them, separately and
            together. No one replies to you, though. Perhaps, you’ve been affected after all.
        </div>,
        'showOnEnd': true,
    }],
};

const STAGE_2A_INT = {
    'text': <div>
        <p>
            Aha. Maybe the Minister of Education and the members of the Parliament will finally
            listen. This sounds like a better opportunity to have an impact; you want to join
            this march.
        </p>
        <p>
            Just as you are wrapping up, some people in the crowd decide to further agitate the
            police. They throw a flaming cardboard “coffin” with the name of South Africa’s
            minister of higher education, Blade Nzimande, at the police. As a result,
            violence breaks out.
        </p>
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
    ...twitter_img_props,
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
    ...social_media_img_props,
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
    'STAGE_1AA_INT': STAGE_1AA_INT,
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

import React from 'react';

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
            You decide to spend some time educating yourself about the #FeesMustFall movement
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
            After mentioning the student demonstrations, such as the sit-in, to your family
            members, they give you some warnings. They didn't think it was worth the risk of
            getting expelled by your school or having any disciplinary and criminal records
            that might make it more difficult for you to find jobs in the future.
        </p>
        <p>
            Ultimately, you decide that you will support the movement in a less confrontational
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
            calling out the government for enacting unfair policies, but also see the
            danger that comes from being in the front lines of the protests, where police can
            physically harm you. After hearing the arguments made by your peers, you decide that
            you will look for other ways to support this movement.
        </p>
        <p>
            In the meantime, the university closes anyway and on the 19th of October, the university
            agrees to begin new negotiations with the students.
        </p>

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
        <p>
            You are the first in your family to attend university and over the past school year, you
            have been focused on getting good marks. You hope to graduate and ultimately secure a
            job. Because you have a lot of upcoming exams, you have been spending time
            reviewing in the university library. When groups of students start coming into the
            library with weapons to protest, you feel a bit intimidated. On Facebook as well
            as other social media platforms, other students accuse you for sympathizing with
            the government; they say that you don’t care enough about the consequences of the
            fee increase for other students.
        </p>
        <p>
            In the meantime, you begin to see more police on your campus.
            However, you also start to hear rumors that your university is starting to negotiate
            with student activists.
        </p>
        <p>
            A few days later, your university closes indefinitely. You start to feel a bit bad
            that you spent those last few days on campus preparing for exams rather than actively
            protesting. You feel guilty and a bit selfish too.
        </p>
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
        'text': <div>Do nothing again because you are still uncomfortable about everything</div>,
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
            media platforms because in South Africa, it was mostly the elites who used Twitter.
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


const introDesc = (
    <>
        <h5>
        You are a sophomore at Rhodes University, in Grahamstown, South Africa.
        </h5>
        <p>
        Reports of tuition increases of up to 10.5% have come out from multiple South African
        universities, including Rhodes. Students at the University of Witwatersrand and the
        University of Cape Town have already begun protesting, and there are rumors floating
        around social media about a student-led total shutdown of the Rhodes Campus.
        </p>
        <p>
        Many students are worried that these higher fees will shut poorer students out of
        education. However, other students are worried that the disruption caused by a protest
        will be more harmful to the ability to learn.
        </p>
    </>
);

const endDesc = (
    <>
        <p>
            On 23 October, 2015, South African President Zuma announced that there would
            be no tuition increases in 2016.
        </p>
        <p>
            Protesters hailed this as a victory, but this announcement did not spell
            the end of the Fallist movement.
        </p>
        <p>
            In 2016, similar rumors about tuition increases started circulating,
            leading to the start of #FeesMustFall2016. Overall, the protests cost
            about 800 million South African rand (42 million <small>USD</small>)
            in damage.
        </p>
    </>
);

const endImg = {
    imgFilename: 'FMF_demonstration_1.jpg',
    imgCaption: (
        <>
            Photo credit:&nbsp;
            <a href="https://search.creativecommons.org/photos/62c80a30-6066-40e7-badc-a6a637099d05" title="via Wikimedia Commons">
                tony4carr
            </a> / <a href="https://creativecommons.org/licenses/by-nc/2.0">CC BY-NC</a>
        </>
    ),
    imgAlt: 'Student protesters during the #FeesMustFall movement',
};

const introImg = {
    imgFilename: 'FMF_intro.png',
    imgCaption: (
        <>
            Photo credit:&nbsp;
            <a
                href="https://commons.wikimedia.org/wiki/File:FMF_-_FeesMustFall.png"
                title="via Wikimedia Commons"
            >David.ritchie.05</a>
            /
            <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA</a>
        </>
    ),
    imgAlt: 'A student protester holding a #FeesMustFall sign',
};

export const feesMustFallAdventure = {
    NAME_TO_STAGE: NAME_TO_STAGE,
    intro: { desc: introDesc, img: introImg },
    end: { desc: endDesc, img: endImg },
};



import React from 'react';
import * as PropTypes from 'prop-types';

const STAGE_1 = {
    'text': <div>A friend texts you about a sit-in at the administrative offices. What is your
        initial reaction?</div>,
    'options': [{
        'text': <div>Agree; you want to participate!</div>,
        'stageName': 'STAGE_1A',
        'detail': '',
        'showOnEnd': true,
    },
    {
        'text': <div>Agree, but you’re a little skeptical: want to learn more</div>,
        'stageName': 'STAGE_1B_INT',
        'detail': '',
        'showOnEnd': true,
    },
    {
        'text': <div>Disagree: you’re really not comfortable being part of this right now</div>,
        'stageName': 'STAGE_1C_INT',
        'detail': '',
        'showOnEnd': true,
    }],
};

const STAGE_1A = {
    'text': <div>A friend texts you about a sit-in at the administrative offices.
        What is your initial reaction?</div>,
    'options': [{
        'text': <div>You get there, but feel the tension of the situation and are worried that the
             sit-in might escalate from a purely peaceful protest because students
             started blockading road access, and you decide to sneak out before things
             get worse.</div>,
        'stageName': 'STAGE_2',
        'detail': '',
        'showOnEnd': true,
    },
    {
        'text': <div>You stay with the movement and help block the roads. After, you join them at
             the sit in. The protesters occupy the admin building and things escalate! You try to
             escape, but get caught by the riot police.</div>,
        'stageName': 'STAGE_1AB_INT',
        'detail': '',
        'showOnEnd': true,
    }],
};

const STAGE_1AB_INT = {
    'text': <div>That night, students hold an all night vigil outside the police station, calling
        for your and your peers’ release. Thankfully, they let you go.</div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': 'STAGE_2',
        'detail': '',
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
        'detail': '',
        'showOnEnd': false,
    }],
};

const STAGE_1C_INT = {
    'text': <div>
        <p>In the meantime, the university closes anyway.</p>
        <p>On 19 October, the University agrees to new negotiations.</p>
    </div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': 'STAGE_2_1C',
        'detail': '',
        'showOnEnd': false,
    }],
};

const STAGE_2 = {
    'text': <div>On 21 October, you hear about the potential march on Parliament.</div>,
    'options': [{
        'text': <div>Join the march</div>,
        'stageName': 'STAGE_2A_INT',
        'detail': <div>WITS university administration announces that no disciplinary action
            will be taken against students and staff members who participated in the
            protests.</div>,
        'showOnEnd': true,
    },
    {
        'text': <div>Participate by social media</div>,
        'stageName': 'STAGE_2B_INT',
        'detail': '',
        'showOnEnd': true,
    },
    {
        'text': <div>Do nothing</div>,
        'stageName': 'STAGE_2C_INT',
        'detail': '',
        'showOnEnd': true,
    }],
};

const STAGE_2_1C = {
    'text': <div>On 21 October, you hear about the potential march on Parliament.</div>,
    'options': [{
        'text': <div>Join the march</div>,
        'stageName': 'STAGE_2A_INT',
        'detail': <div>WITS university administration announces that no disciplinary action
            will be taken against students and staff members who participated in the
            protests.</div>,
        'showOnEnd': true,
    },
    {
        'text': <div>Participate by social media</div>,
        'stageName': 'STAGE_2B_INT',
        'detail': '',
        'showOnEnd': true,
    },
    {
        'text': <div>Still, you’re not comfortable; you again do nothing</div>,
        'stageName': 'STAGE_2C_INT',
        'detail': <div>You’ve remained outside the action the whole time. But you feel
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
    'options': [{
        'text': <div>Next</div>,
        'stageName': null,
        'detail': '',
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
            </div>,
    'options': [{
        'text': <div>Next</div>,
        'stageName': null,
        'detail': '',
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
        'detail': '',
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

const getStageFromName = (stageName) => {
    return NAME_TO_STAGE[stageName];
};

class Option extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const stage = getStageFromName(this.props.option.stageName);
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
            stage: getStageFromName('STAGE_1'),
        };
    }

    setStage = (stage, option) => {
        this.props.updateHistory(option);
        if (option.stageName) {
            this.setState({ stage: getStageFromName(option.stageName) });
        } else {
            this.props.setView('end');
        }
        this.setState({ stage: stage });
    };

    render() {
        let optionComponents = <div>Loading...</div>;
        if (this.state.stage.options) {
            optionComponents = this.state.stage.options.map((option, k) => {
                return (
                    <Option
                        key={k} option={option} setStage={this.setStage}
                    />
                );
            });
        }
        return (
            <div className={'wrapper'}>
                <div className='row'>
                    <div className={'col-6'}>
                        <p>{this.state.stage.text}</p>
                        <div className="option-selectors-list">
                            {optionComponents}
                        </div>
                    </div>
                    <img className='col-6 stage-img' src={this.props.imgFile} alt="Sample" />
                </div>

            </div>
        );
    }
}
StageView.propTypes = {
    stageName: PropTypes.string,
    updateHistory: PropTypes.func,
    setView: PropTypes.func,
    imgFile: PropTypes.string,
};

export default StageView;

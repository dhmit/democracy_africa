import React from 'react';

const staffMembers = [
    {
        name: 'Michael Scott Cuthbert',
        title: 'Faculty Director & Associate Professor',
        photoSrc: 'michael_scott_cuthbert.jpg',
    },
    {
        name: 'Ryaan Ahmed',
        title: 'Technical Director Senior Research Engineer',
        photoSrc: 'ryaan_ahmed.jpg',
    },
    {
        name: 'Erica Zimmer',
        title: 'Postdoctoral Associate',
        photoSrc: 'erica_zimmer.jpg',
    },
    {
        name: 'Nicole Fountain',
        title: 'Administrative Assistant',
        photoSrc: 'nicole_fountain.jpg',
    },
];

const studentMembers = [
    {
        name: 'Amy Lei',
        photoSrc: 'amy_lei.jpg',
    },
    {
        name: 'Angelica Castillejos',
        photoSrc: 'angelica_castillejos.jpg',
    },
    {
        name: 'Benjamin Gao',
        photoSrc: 'benjamin_gao.jpg',
    },
    {
        name: 'Crista Falk',
        photoSrc: 'crista_falk.jpg',
    },
    {
        name: 'Dillon Weber',
        photoSrc: 'dillon_weber.jpg',
    },
    {
        name: 'Felix Li',
        photoSrc: 'felix_li.jpg',
    },
    {
        name: 'Ivy Mao',
        photoSrc: 'ivy_mao.jpg',
    },
    {
        name: 'Jason Lin',
        photoSrc: 'jason_lin.jpg',
    },
    {
        name: 'Jordon Wilke',
        photoSrc: 'jordon_wilke.jpg',
    },
    {
        name: 'Justice Vidal',
        photoSrc: 'justice_vidal.jpg',
    },
    {
        name: 'Mayowa Songonuga',
        photoSrc: 'mayowa_songonuga.jpg',
    },
    {
        name: 'Meesue Kim',
        photoSrc: 'meesue_kim.jpg',
    },
    {
        name: 'Melissa Calvert',
        photoSrc: 'melissa_calvert.jpg',
    },
    {
        name: 'Michelle He',
        photoSrc: 'michelle_he.jpg',
    },
    {
        name: 'Montserrat Garza',
        photoSrc: 'montserrat_garza.jpg',
    },
    {
        name: 'Ning-Er Lei',
        photoSrc: 'ning_er_lei.jpg',
    },
    {
        name: 'Ophelia Zhu',
        photoSrc: 'ophelia_zhu.jpg',
    },
    {
        name: 'Samantha York',
        photoSrc: 'samantha_york.jpg',
    },
];

const edXURL = 'https://www.edx.org/course/democracy-and-development-perspectives-from-afri-2';

class About extends React.Component {
    render() {
        return (
            <div className='about'>
                <div className='about-title'>
                    About This Project
                </div>
                <div className='about-text row'>
                    <div className='evan-img-div col-md-12 col-lg-3'>
                        <img
                            className='evan-img'
                            src={'/static/img/team/evan_lieberman.jpg'}
                            alt='Evan Lieberman'
                            align='left'
                        />
                    </div>
                    <div className='col-md-12 col-lg-9'>
                        <p>
                            <i>Gamifying "Democracy and Development: Perspectives from Africa"</i>
                            is a project by the <a href='https://digitalhumanities.mit.edu/'> MIT
                            Digital Humanities Lab</a> in collaboration with our Spring 2020
                            Faculty Fellow, Evan Lieberman, Total Professor of Political Science
                            and Contemporary Africa at MIT.
                        </p>
                        <p>
                            We are collaborating to create interactive simulations and games around
                            topics affecting democratic development in Africa, which will be
                            integrated into the EdX
                            Course <a href={edXURL}><i>Democracy and Development: Perspectives
                            from Africa</i></a>.
                        </p>
                        <p>
                            Simulations can empower students by providing hands-on engagement with
                            concepts that are otherwise abstract or theoretical. Researchers and
                            policy-makers can use simulations to understand how models play out
                            under a variety of starting conditions.
                        </p>
                        <p>
                            This project consists of two simulations. The first one is
                            the <a href={'/adventure'}>Choose Your Own Adventure</a> simulation
                            which puts you into the life of a South African university student
                            during the Fees Must Fall movement in 2015.
                            In this simulation, you can choose different actions to take with
                            respect to the protest, leading you to experience various perspective
                            of the movement.
                        </p>
                        <p>
                            The second simulation is
                            the <a href={'/campaign_game'}>Campaign Game</a>.
                            In this game, you are a politician running for a position. Using the
                            information you are given about the needs of the citizens from your
                            country, you will make a campaign that places varying levels of focus
                            on different services in order to get a majority of the votes.
                        </p>
                    </div>
                </div>
                <div className='team'>
                    <div className='about-title'>Staff</div>
                    <div className='staff row'>
                        {staffMembers.map((member, k) => (
                            <div
                                className='staff-member col-12 col-sm-6 col-lg-3'
                                key={k}
                            >
                                <img
                                    className='staff-img'
                                    src={'/static/img/team/' + member.photoSrc}
                                    alt={member.name}
                                />
                                <div className='staff-name'>
                                    {member.name}
                                </div>
                                <div className='job-title'>
                                    {member.title}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='about-title'>UROP Members</div>
                    <div className='students row'>
                        {studentMembers.map((member, k) => (
                            <div
                                className='student-member col-12 col-sm-6 col-md-4 col-lg-3'
                                key={k}
                            >
                                <img
                                    className='student-img'
                                    src={'/static/img/team/' + member.photoSrc}
                                    alt={member.name}
                                />
                                <div className='student-name'>
                                    {member.name}
                                </div>
                                <div className='job-title'>
                                    UROP
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default About;

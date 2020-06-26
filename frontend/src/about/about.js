import React from 'react';

const staffMembers = [
    {
        name: 'Michael Scott Cuthbert',
        title: 'Faculty Director & Associate Professor',
        photoSrc: '',
    },
    {
        name: 'Ryaan Ahmed',
        title: 'Technical Director Senior Research Engineer',
        photoSrc: '',
    },
    {
        name: 'Erica Zimmer',
        title: 'Postdoctoral Associate',
        photoSrc: '',
    },
    {
        name: 'Nicole Fountain',
        title: 'Administrative Assistant',
        photoSrc: '',
    },
];

const studentMembers = [
    {
        name: 'Michelle He',
        photoSrc: ''
    },
    {
        name: 'Justice Vidal',
        photoSrc: ''
    },
    {
        name: 'Jason Lin',
        photoSrc: ''
    },
    {
        name: 'Ning-Er Lei',
        photoSrc: ''
    },
];

class About extends React.Component {
    render() {
        return (
            <div className='about'>
                <div className='about-title'>
                    About This Project
                </div>
                <div className='about-text'>
                    <p>
                        <i>Gamifying "Democracy and Development: Perspectives from Africa"</i> is a
                        project by the MIT Programs in Digital Humanities in collaboration with our
                        Spring 2020 Faculty Fellow, Evan Lieberman, Total Professor of Political
                        Science and Contemporary Africa at MIT.
                    </p>
                    <p>
                        We are collaborating to create interactive simulations to integrate into
                        the EdX Course Democracy and Development: Perspectives from Africa.
                    </p>
                </div>
                <div className='team'>
                    <div className='about-title'>Staff and Members</div>
                    <div className='staff'>
                        {staffMembers.map((member, k) => (
                            <div className='staff-member' key={k}>
                                {member.name}
                            </div>
                        ))}
                    </div>
                    <div className='students'>
                        {studentMembers.map((member, k) => (
                            <div className='student-member' key={k}>
                                {member.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default About;

import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronUp,
    faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import Chip from './Chip';



class Font extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            accordionExpanded: false
        };
        this.handleToggleAccordion = this.handleToggleAccordion.bind(this);
    }

    handleToggleAccordion() {
        this.setState({ accordionExpanded: !this.state.accordionExpanded });
    }

    render () {
        const { name, elem, serif } = this.props;
        const { accordionExpanded } = this.state;

        return (
            <div
                style={{
                    width: '100%',
                }}
                class={serif ? '-serif' : ''}
            >
                <div
                    className="accordionHead"
                    onClick={this.handleToggleAccordion}
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Chip label={name} />
                    <FontAwesomeIcon icon={accordionExpanded ? faChevronUp : faChevronDown} />
                </div>
                <div
                    style={{
                        marginBottom: '2rem',
                        marginTop: '1rem',
                        width: '100%',
                    }}
                >
                    {React.createElement(elem,
                        null,
                        "English: The quick brown fox jumps over the lazy dog."
                    )}
                    <br />
                    {accordionExpanded && (
                        <React.Fragment>
                            {React.createElement(elem,
                                null,
                                "Arabic: الثعلب البني السريع يقفز فوق الكلب الكسول."
                            )}
                            <br />
                            {React.createElement(elem,
                                null,
                                "Bengali: দ্রুত বাদামী শিয়াল অলস কুকুর উপর লাফালাফি।"
                            )}
                            <br />
                            {React.createElement(elem,
                                null,
                                "Chinese: 敏捷的棕色狐狸跳过了懒狗。"
                            )}
                            <br />
                            {React.createElement(elem,
                                null,
                                "Greek: Η γρήγορη καφέ αλεπού πηδάει πάνω από το τεμπέλικο σκυλί."
                            )}
                            <br />
                            {React.createElement(elem,
                                null,
                                "Hebrew: השועל החום המהיר קופץ מעל הכלב העצל."
                            )}
                            <br />
                            {React.createElement(elem,
                                null,
                                "Hindi: तेज, भूरी लोमडी आलसी कुत्ते के उपर कूद गई।"
                            )}
                            <br />
                            {React.createElement(elem,
                                null,
                                "Sanskrit: समाहारः साम्नां प्रतिपदमृचां धाम यजुषां"
                            )}
                        </React.Fragment>
                    )}
                </div>
            </div>
        );
    }
}

Font.propTypes = {
    name: PropTypes.string,
    elem: PropTypes.string,
};

export default Font;

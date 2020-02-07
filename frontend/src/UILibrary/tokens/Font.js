import React from 'react';
import PropTypes from 'prop-types';
import Chip from './Chip';


const Font = ({ name, elem }) => (
    <div
        style={{
            width: '100%',
        }}
    >
        <Chip label={name} />
        <div
            style={{
                marginBottom: '7rem',
                marginTop: '1rem',
                width: '100%',
            }}
        >
            {React.createElement(elem,
                null,
                "English: The quick brown fox jumps over the lazy dog."
            )}
            <br />
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
        </div>
    </div>
);

Font.propTypes = {
    name: PropTypes.string,
    elem: PropTypes.string,
};

export default Font;

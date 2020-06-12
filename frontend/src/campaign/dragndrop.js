import React from 'react';
import * as PropTypes from 'prop-types';


function getDragAfterElement(props, y) {
    const draggableElements = [...props.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset,
                element: child
            };
        }
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

export function Flexboard(props) {
    const drop = (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('cardId');

        const card = document.getElementById(cardId);
        card.style.display = 'block';

        e.target.appendChild(card);
    };

    const dragOver = (e) => {
        e.preventDefault();
        // const afterElement = getDragAfterElement(props, e.ClientY);
        // console.log(afterElement);
    };

    return (
        <div
            id={props.id}
            className={props.className}
            onDrop={drop}
            onDragOver={dragOver}
        >
            { props.children }
        </div>
    );
}


export function Flexcard(props) {
    const dragStart = (e) => {
        const target = e.target;

        e.dataTransfer.setData('cardId', target.id);

        // setTimeout(() => {
        //    target.style.display = 'none';
        // }, 0);
    };

    const dragOver = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            id={props.id}
            className={props.children}
            draggable={props.draggable}
            onDragStart={dragStart}
            onDragOver={dragOver}
        >
            { props.children }
        </div>
    );
}


Flexboard.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.func
};


Flexcard.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.func,
    draggable: PropTypes.bool
};

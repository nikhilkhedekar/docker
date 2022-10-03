import React from 'react';

function GoalItem(props) {
    return <li onClick={props.onDelete.bind(null, props.id)}>
        {props.text}
    </li>;
}

export default GoalItem;

import React from 'react';

import classes from './Order.css';

const order = (props) => {
    const ingredientsOutput = Object.keys(props.ingredients).map(igKey => (
        <span
            key={igKey}
            style={{
            textTransform: 'capitalize',
            display: 'inline-block',
            margin: '0 8px',
            border: '1px solid #ccc',
            padding: '5px'
        }}>{igKey} ({props.ingredients[igKey]})</span>
    ));

    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredientsOutput}</p>
            <p>Price: <strong>USD {props.price}</strong></p>
        </div>
    );
};

export default order;

import React from 'react';

import BuildCOntrol from './BuildControl/BuildControl';

import classes from './BuildControls.css';

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Meat', type: 'meat' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
];

const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Total price: <strong>{props.price.toFixed(2)}</strong></p>
        {controls.map(ctrl => {
            return <BuildCOntrol
                key={ctrl.label}
                label={ctrl.label}
                added={() => { props.added(ctrl.type) }}
                removed={() => { props.removed(ctrl.type) }}
                disabled={props.disabledInfo[ctrl.type]} />;
        })}
        <button
            className={classes.OrderButton}
            disabled={!props.purchaseable}
            onClick={props.ordered}>{props.isAuth ? 'Order Now' : 'Sign in to order'}</button>
    </div>
);

export default buildControls;
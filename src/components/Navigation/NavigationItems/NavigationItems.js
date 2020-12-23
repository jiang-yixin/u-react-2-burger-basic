import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.css';

const navigationItems = (props) => (
    <div className={classes.NavigationItems}>
        <NavigationItem link="/" active>Burger builder</NavigationItem>
        <NavigationItem link="/">Checkout</NavigationItem>
    </div>
);

export default navigationItems;
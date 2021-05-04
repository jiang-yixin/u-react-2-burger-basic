import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.css';

const navigationItems = (props) => (
    <div className={classes.NavigationItems}>
        <NavigationItem link="/" exact>Burger builder</NavigationItem>
        {props.isAuthenticated ? <NavigationItem link="/orders">Orders</NavigationItem> : null}
        {props.isAuthenticated ?
            <NavigationItem link="/logout">Logout</NavigationItem>
            : <NavigationItem link="/auth">Authentication</NavigationItem>}
    </div>
);

export default navigationItems;
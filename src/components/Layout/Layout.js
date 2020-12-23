import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import BurgerBuilder from '../../containers/BurgerBuilder/BurgerBuilder';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

import classes from './Layout.css';

class Layout extends Component {
    state = {
        showSideDrawer: true
    }

    closeSideDrawerHandler = () => {
        this.setState({ showSideDrawer: false });
    }

    render() {
        return (
            <Aux>
                <Toolbar />
                <SideDrawer
                    show={this.state.showSideDrawer}
                    close={this.closeSideDrawerHandler} />
                <main className={classes.Content}>
                    <BurgerBuilder />
                </main>
            </Aux>
        );
    }
}

export default Layout;
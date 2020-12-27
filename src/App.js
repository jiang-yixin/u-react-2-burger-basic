import React, { Component } from 'react';

import Layout from './hoc/Layout/Layout';

class App extends Component {
    state = {
        show: true,
    }

    render() {
        return (
            <div>
                { this.state.show ? <Layout /> : null}
            </div>
        );
    }
}

export default App;

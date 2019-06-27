import React, { Component } from 'react';
import './App.css';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

import { updateUser } from "./redux/action_creators/action_creators";

import Edit from "./views/edit/edit";
import Login from "./views/login/login";
import Play from "./views/play/play";
import Setup from "./views/setup/setup";

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    axios.post("/auth/me")
      .then(response => {
        if (response.data.success)
          this.props.updateUser(response.data.username);
        console.log(response)
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/edit" component={Edit} />
            <Route path="/setup" component={Setup} />
            <Route path="/play" component={Play} />
            <Route path="/" component={Login} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default connect(null, {updateUser})(App);

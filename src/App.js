import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Edit from "./views/edit/edit";
import Login from "./views/login/login";
import Play from "./views/play/play";
import Setup from "./views/setup/setup";

function App() {
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

export default App;

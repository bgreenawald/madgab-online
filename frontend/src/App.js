import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import './App.scss';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Landing from './components/Landing';
import Game from './components/Game'

class App extends Component {
  render() {
    return ( 
      <Router>
        <React.Fragment>
          <Route exact path='/' render={props=><Landing {...props}/>}/>
          <Route path='/game' render={props=><Game {...props}/>}/>
        </React.Fragment>
      </Router>
      );
  }
}

export default App;

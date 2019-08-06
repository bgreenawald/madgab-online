import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Landing from './components/Landing';

class App extends Component {
  render() {
    return ( 
      <Router>
        <React.Fragment>
          <Route exact path='/' render={props=><Landing/>}/>
        </React.Fragment>
      </Router>
      );
  }
}

export default App;

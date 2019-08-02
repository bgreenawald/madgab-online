import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Landing from './components/Landing';

function App() {
  return ( 
  <Router>
    <React.Fragment>
      <Route exact path='/' render={props=><Landing/>}/>
    </React.Fragment>
  </Router>
  );
}

export default App;

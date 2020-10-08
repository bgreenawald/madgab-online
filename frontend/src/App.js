import React, {Component} from 'react';
// import ReactDOM from 'react-dom';

import './Styles/App.scss';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Landing from './components/Landing';
import Game from './components/Game';
import Socket from './components/Socket';

class App extends Component {

  componentWillUnmount() {
    Socket.on("disconnect", () => {
      Socket.removeAllListeners();
    })
  }

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

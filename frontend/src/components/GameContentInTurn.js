import React, { Component } from "react";
import "../Styles/App.scss";
import "../Styles/Game.scss"
import io from "socket.io-client";

import { connect } from 'react-redux';
import { } from '../store/actions'

class GameContentInTurn extends Component {

  componentDidMount = () => {
  }

  render() {
    return (
      <div className="game-content">
        <div id="timer" ref={this.timerDOM}></div>
        <div className="card clue">{this.props.state.current_madgab}</div>
        <div className="buttons">
          <button className="pass">Pass</button>
          <button className="correct">Correct</button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}

const mapStateToProps = state => {
  return {
    state: { ...state }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContentInTurn);

import React, { Component } from "react";
import "../Styles/App.scss";
import "../Styles/Game.scss"
import io from "socket.io-client";

import { connect } from 'react-redux';
import { decreaseTimer, updateGameData } from '../store/actions'

let socket = io('http://localhost:5000');

class GameContentInTurn extends Component {

  constructor() {
    super();
    this.timerDOM = React.createRef();
  }

  componentDidMount = () => {
    this.startTimer()
  }

  startTimer = () => {
    setInterval(this.decrementTimer, 1000)
  }

  decrementTimer = () => {
    if (this.props.state.timer === 0) clearInterval();
    else this.props.decreaseTimer();
  }

  render() {
    return (
      <div className="game-content reader-view">
        <div id="timer" ref={this.timerDOM}>{this.props.state.timer}s</div>
        <div className="card clue">
          <p>{this.props.state.current_madgab}</p>
          <span className="clue-count">/3</span>
        </div>
        <div className="buttons">
          <button className="correct primary">Correct</button>
          <button className="pass secondary">Pass</button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    decreaseTimer: () => {
      dispatch(decreaseTimer())
    },
    updateGameData: () => {
      dispatch(updateGameData())
    }
  }
}

const mapStateToProps = state => {
  return {
    state: { ...state }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContentInTurn);

import React, { Component } from "react";
import "../Styles/App.scss";
import "../Styles/Game.scss";
import io from "socket.io-client";

import { connect } from 'react-redux';
import { decreaseTimer, updateGameData } from '../store/actions'

import Countdown from './Countdown';

let socket = io('http://localhost:5000');

class InTurn extends Component {

  constructor() {
    super();
    this.timerDOM = React.createRef();
    this.countdownOffsetTimer = 4;
  }

  componentDidMount = () => {
    this.resetTimer();
    this.timerID = this.startTimer();
    this.props.updateGameData({
      inCountdown: true,
    })
  }

  componentWillUnmount = () => {
    clearInterval(this.timerID);
  }

  startTimer = () => {
    return setInterval(this.decrementTimer, 1000)
  }

  resetTimer = () => {
    this.props.updateGameData({
      timer: this.props.state.seconds_per_turn + this.countdownOffsetTimer
    })
  }

  decrementTimer = () => {
    if (this.props.state.timer <= 0) {
      socket.emit("end_active_state", {
        "name": this.props.state.id,
        "correct": false,
        "time_left": 0
      })
      clearInterval(this.timerID);
      this.resetTimer();
    }
    else this.props.decreaseTimer();
  }

  loadLastClue = (didGuessCorrectly) => {
    clearInterval(this.startTimer);

    // update front end state
    this.props.updateGameData({
      lastGuessResult: didGuessCorrectly,
      time_left: this.props.state.timer
    })

    // move back end state to next game state
    socket.emit("end_active_state", {
      "name": this.props.state.id,
      "correct": didGuessCorrectly,
      "time_left": this.props.state.timer
    })
  }

  loadNextClue = (didGuessCorrectly) => {
    if (this.props.state.current_turn_counter === this.props.state.words_per_turn) {
      this.loadLastClue(didGuessCorrectly);
    }

    socket.emit("new_phrase", {
      "name": this.props.state.id,
      "correct": didGuessCorrectly
    })
  }

  render() {
    if (this.props.state.inCountdown === true) {
      return (
        <div className="game-content">
          <Countdown loadingMessage="Ready?" />
        </div>
      )
    }
    else {
      return (
        <div className="game-content">
          <div id="timer" ref={this.timerDOM}>{this.props.state.timer}s</div>
          <div className="card clue">
            {this.props.state.userRole === "reader" ? <p id="clue-answer">{this.props.state.current_phrase}</p> : null}
            <p id="clue-current">{this.props.state.current_madgab}</p>
            <span className="clue-count">{this.props.state.current_turn_counter}/3</span>
          </div>
          <div className="buttons">
            <button className="correct primary" onClick={didGetCorrect => this.loadNextClue(true)}>Correct</button>
            <button className="pass secondary" onClick={didGetWrong => this.loadNextClue(false)}>Pass</button>
          </div>
        </div>
      );
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    decreaseTimer: () => {
      dispatch(decreaseTimer())
    },
    updateGameData: (data) => {
      dispatch(updateGameData(data))
    }
  }
}

const mapStateToProps = state => {
  return {
    state: { ...state }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InTurn);
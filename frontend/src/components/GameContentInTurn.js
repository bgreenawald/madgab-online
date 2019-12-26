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
    this.resetTimer();
    this.timerID = this.startTimer();
  }

  componentWillUnmount = () => {
    clearInterval(this.timerID);
  }

  startTimer = () => {
    return setInterval(this.decrementTimer, 1000)
  }

  resetTimer = () => {
    this.props.updateGameData({
      timer: this.props.state.seconds_per_turn
    })
  }

  decrementTimer = () => {
    if (this.props.state.timer === 0 || this.props.state.timer < 0) {
      socket.emit("end_turn", {
        "name": this.props.state.id,
        "correct": false,
        "time_left": 0
      })
      clearInterval(this.timerID);
      this.resetTimer();
    }
    else this.props.decreaseTimer();
  }

  loadNextClue = (didGuessCorrectly) => {
    if (this.props.state.current_turn_counter === this.props.state.words_per_turn) {
      clearInterval(this.startTimer);
      socket.emit("end_turn", {
        "name": this.props.state.id,
        "correct": didGuessCorrectly,
        "time_left": this.props.state.timer
      })
    }
    socket.emit("new_phrase", {
      "name": this.props.state.id,
      "correct": didGuessCorrectly
    })
  }

  render() {
    return (
      <div className="game-content reader-view">
        <div id="timer" ref={this.timerDOM}>{this.props.state.timer}s</div>
        <div className="card clue">
          {this.props.state.userRole === "reader" ? <p id="clue-answer">{this.props.state.current_phrase}</p> : null}
          <p id="clue-current">{this.props.state.current_madgab}</p>
          <span className="clue-count">/3</span>
        </div>
        <div className="buttons">
          <button className="correct primary" onClick={didGetCorrect => this.loadNextClue(true)}>Correct</button>
          <button className="pass secondary" onClick={didGetCorrect => this.loadNextClue(false)}>Pass</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(GameContentInTurn);
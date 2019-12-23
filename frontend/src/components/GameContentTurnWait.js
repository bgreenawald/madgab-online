import React, { Component } from "react";
import "../Styles/App.scss";
import "../Styles/Game.scss";

import { connect } from "react-redux";
import { startTurn } from "../store/actions";
import io from "socket.io-client";

class GameContentTurnWait extends Component {
  handleStartTurn = () => {
    let socket = io("http://localhost:5000");

    // console.log("starting the turn~~!");
    // socket.emit("join", this.props.state.gameID);
    socket.emit("start_turn", {
      "name": this.props.state.gameID
    })
  };

  // start_timer = () => {
  //   let socket = io("http://localhost:5000");
  //   let id = this.state.game_id;
  //   // let timer = this.state.seconds_per_turn

  //   var minutes = parseInt(this.state.seconds_per_turn / 60, 10);
  //   var seconds = parseInt(this.state.seconds_per_turn % 60, 10);

  //   minutes = minutes < 10 ? "0" + minutes : minutes;
  //   seconds = seconds < 10 ? "0" + seconds : seconds;

  //   this.timerDOM.current.innerText = minutes + ":" + seconds;

  //   if (--this.state.seconds_per_turn < 0) {
  //     socket.emit("end_turn", {
  //       name: id,
  //       correct: false,
  //       time_left: 0
  //     });
  //   }
  // };

  render() {
    return (
      <div className="game-content">
        <div className="turn-container textbox">
          <h3>It's your turn:</h3>
          <h2>{this.props.active_team === 1 ? "Blue" : "Red"} Team</h2>
        </div>

        <button
          aria-label="start turn"
          type="submit"
          id="start-turn primary"
          className="primary button"
          ref={this.startTurn}
          // disabled={this.props.userRole === null}
          onClick={this.handleStartTurn}
        >
          Start turn!
        </button>

        <div className="game-options textbox">
          <input
            type="checkbox"
            name="userRole"
            ref={this.props.userRole}
            onChange={this.handleRoleSelected}
            value="clue giver"
          />
          <label htmlFor="Yes">I'm the clue reader</label>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    startTurn: () => dispatch(startTurn())
  }
}

const mapStateToProps = state => {
  return {
    state: { ...state }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameContentTurnWait);

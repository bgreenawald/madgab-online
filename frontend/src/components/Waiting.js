import React, { Component } from "react";

import { connect } from "react-redux";
import { startTurn, toggleUserRole } from "../store/actions";
import io from "socket.io-client";


class Waiting extends Component {
  handleStartTurn = () => {
    let socket = io("http://localhost:5000");
    socket.emit("start_turn", {
      "name": this.props.state.id
    })
  };

  setRole = () => {
    this.props.toggleUserRole();
  }

  render() {
    let currentTeam = this.props.state.currentTeam.charAt(0).toUpperCase() + this.props.state.currentTeam.slice(1);
    return (
      <div className="game-content">
        <div className="turn-container textbox">
          <h3>It's your turn:</h3>
          <h1 className='active-team'>{currentTeam} Team</h1>
        </div>

        <button
          aria-label="start turn"
          type="submit"
          id="start-turn"
          className="primary button"
          ref={this.startTurn}
          onClick={this.handleStartTurn}
        >
          Start turn!
        </button>

        <div className="game-options textbox">
          <input
            type="checkbox"
            name="userRole"
            value="clue giver"
            onChange={this.setRole}
          />
          <label htmlFor="Yes">I'm the clue reader</label>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    startTurn: () => dispatch(startTurn()),
    toggleUserRole: () => dispatch(toggleUserRole())
  }
}

const mapStateToProps = state => {
  return {
    state: { ...state }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Waiting);

import React, { Component } from "react";
import "../Styles/Game.scss";
import io from "socket.io-client";

import Header from "./Header";
import Footer from "./Footer";
import TurnWaitStart from "./GameContentTurnWait";
import InTurn from "./GameContentInTurn";

import { connect } from "react-redux";
import { fetchGameData } from '../store/actions';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      //  href_parts = window.location.href.split("/"),
      active_team: 1,
      game_name: this.props.history.location,
      userTeam: 1,
      userRole: "guesser"
    };
    this.socket = io("http://localhost:5000/");
    this.clueRadioYes = React.createRef();
    this.clueRadioNo = React.createRef();
    this.timerDOM = React.createRef();
  }
  // join socket, load board, and render board
  componentDidMount = () => {
    let socket = io("http://localhost:5000");
    let id = this.state.game_id;
    socket.on("connect", () => {
      socket.emit("join", id);
      socket.emit("load_board", {
        name: id
      });
      socket.on("render_board", resp => {
        let game_state = JSON.parse(resp.payload);
        this.setState({
          ...game_state,
          loaded: true
        });
      });
    });
  };

  handleRoleSelected = () => {
    this.setState({
      userRole: document.querySelector('input[name="userRole"]:checked').value
    });
  };

  handleTeamSelection = e => {
    let chosenTeam = Number(
      document.querySelector('input[name="teamChoice"]:checked').value
    );
    let bgColor =
      chosenTeam === 1 ? "team1 game-viewport" : "team2 game-viewport";

    this.setState({
      userTeam: chosenTeam,
      bgcolor: bgColor
    });
  };

  render() {
    return (
      <div className="game-container">
        <Header {...this.state} />
        <TurnWaitStart {...this.state} />
        <Footer {...this.state} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleDifficulty: () => {
      dispatch({
        type: "TOGGLE_DIFFICULTY",
        difficulty: "hard"
      });
    },
    fetchGameData: () => dispatch(fetchGameData()),
  };
};

const mapStateToProps = state => {
  return {
    state: { ...state }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);

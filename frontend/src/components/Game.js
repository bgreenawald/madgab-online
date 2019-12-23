import React, { Component } from "react";
import "../Styles/Game.scss";
import io from "socket.io-client";

import Header from "./Header";
import Footer from "./Footer";
import TurnWaitStart from "./GameContentTurnWait";
import InTurn from "./GameContentInTurn";

import { connect } from "react-redux";
import { fetchGameData, updateGameData } from '../store/actions';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      active_team: 1,
      game_name: this.props.history.location,
      userTeam: 1,
      userRole: "guesser"
    };
    this.clueRadioYes = React.createRef();
    this.clueRadioNo = React.createRef();
    this.timerDOM = React.createRef();
  }

  getGameId = () => {
    let id = this.props.state.id;
    let url = window.location.href;
    if (this.props.state.id === 'loading...') {
      let urlParts = url.split("/");
      id = urlParts[urlParts.length - 1]
    }
    this.props.updateGameData({
      id: id
    });
    return id;
  }
  // join socket, load board, and render board
  componentDidMount = () => {
    let socket = io("http://localhost:5000");
    let id = this.getGameId();

    socket.on("connect", (resp) => {
      socket.emit("join", id);
    });

    socket.on("connect", (resp) => {
      socket.emit("load_board", {
        name: id
      });
    });

    socket.on("render_board", resp => {

      let data = resp.payload
      console.log('full response:', resp)
      console.log('resp.payload \n', data, ' \n is typeof', typeof (resp.payload))

      if (typeof (resp.payload) === 'string') {
        console.log("it's an object!")
        if (resp.payload.includes("{")) {
          data = JSON.parse(resp.payload)
        }
      }

      this.props.updateGameData(data)
      this.props.updateGameData({
        timer: this.props.state.seconds_per_turn
      })
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
    let socket = io("http://localhost:5000");

    socket.on("start_turn", resp => {
      console.log("start turn!", resp)
    })
    return (
      <div className="game-container">
        <Header {...this.state} />
        {this.props.state.state === "ACTIVE" ? <InTurn /> : <TurnWaitStart {...this.state} />}
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
    fetchGameData: () => {
      dispatch(fetchGameData())
    },
    updateGameData: (gameData) => {
      dispatch(updateGameData(gameData))
    }
  };
};

const mapStateToProps = state => {
  return {
    state: { ...state }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);

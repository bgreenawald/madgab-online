import React, { Component } from "react";
import "../Styles/Game.scss";
import Header from "./Header";
import Footer from "./Footer";
import io from "socket.io-client";
// import $ from "jquery";
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
      game_id: this.props.history.location.state.game_id,
      game_name: this.props.history.location,
      inTurn: false,
      userTeam: 1,
      userRole: "guesser"
    };
    this.socket = io("http://localhost:5000/");
    this.clueRadioYes = React.createRef();
    this.clueRadioNo = React.createRef();
    this.startTurn = React.createRef();
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
        // console.log("RESP from render board", game_state);
        this.setState({
          ...game_state,
          loaded: true
        });
      });
    });
  };

  handleGameStart = () => {
    this.setState({
      turn_timer: 90
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

  start_timer = () => {
    let socket = io("http://localhost:5000");
    let id = this.state.game_id;
    // let timer = this.state.seconds_per_turn

    var minutes = parseInt(this.state.seconds_per_turn / 60, 10);
    var seconds = parseInt(this.state.seconds_per_turn % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    this.timerDOM.current.innerText = minutes + ":" + seconds;

    if (--this.state.seconds_per_turn < 0) {
      socket.emit("end_turn", {
        name: id,
        correct: false,
        time_left: 0
      });
    }
  };

  handleStartTurn = () => {
    let timer = this.state.seconds_per_turn;
    let turn_timer = setInterval(this.start_timer, 1000);
    let socket = io("http://localhost:5000");
    let id = this.state.game_id;
    socket.on("connect", resp => {
      socket.emit("start_turn", {
        name: id
      });
    });
    this.setState({
      inTurn: true
    });
  };

  render() {
    console.log("PROPS", this.props);
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
    fetchGameData: () => dispatch(fetchGameData())
  };
};

const mapStateToProps = state => {
  return {
    state: { ...state }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);

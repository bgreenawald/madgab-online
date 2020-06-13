import React, { Component } from "react";
import "../Styles/Game.scss";
import io from "socket.io-client";

import Header from "./Header";
import Footer from "./Footer";
import TurnWaitStart from "./Waiting";
import InTurn from "./InTurn";
import Stealing from "./Stealing";
import ScoreReview from "./ScoreReview";

import { connect } from "react-redux";
import { fetchGameData, updateGameData } from '../store/actions';

class Game extends Component {
  constructor(props) {
    super(props);
    this.clueRadioYes = React.createRef();
    this.clueRadioNo = React.createRef();
    this.timerDOM = React.createRef();
  }

  componentDidMount = () => {
    let socket = io("http://localhost:5000");
    let id = this.getGameId();

    socket.on("connect", (resp) => {
      socket.emit("join", {
        name: id
      });
    });

    socket.on("connect", (resp) => {
      socket.emit("load_board", {
        name: id
      });
    });

    socket.on("render_board", resp => {

      const data = this.parsePayload(resp.payload)
      data.currentTeam = data.team_1_turn ? 'blue' : 'red';
      data.opposingTeam = data.team_1_turn ? 'red' : 'blue';
      data.backgroundColor = (data.state === "STEALING") ? data.opposingTeam : data.currentTeam;
      console.log('event received: \n', resp.message, '\n', data)

      this.props.updateGameData(data);
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.state.state !== this.props.state.state
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

  parsePayload = payload => {
    if (typeof (payload) === 'string') {
      if (payload.includes("{")) {
        return JSON.parse(payload)
      }
    }
    return payload
  }

  handleRoleSelected = () => {
    this.props.updateGameData({
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

  renderGameContent = () => {
    const state = this.props.state.state;

    switch (state) {
      case 'ACTIVE':
        return <InTurn />
      case 'REVIEW':
        return <ScoreReview />
      case 'STEALING':
        return <Stealing />
      case 'IDLE':
        return <TurnWaitStart />
      default:
        return <TurnWaitStart />
    }
  }

  render() {
    let socket = io("http://localhost:5000");

    socket.on("start_turn", resp => {
      console.log("start turn!", resp)
    })

    // if (!this.props.state.data) return null;

    return (
      <div className={`game-container ${this.props.state.backgroundColor}`}>
        <Header {...this.state} />

        {this.renderGameContent()}
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

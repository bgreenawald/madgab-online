import React, { Component } from "react";
import "../Styles/Game.scss";
import Socket from './Socket';

import Header from "./Header";
import Footer from "./Footer";
import TurnWaitStart from "./Waiting";
import InTurn from "./InTurn";
import GameOver from './GameOver';
import Stealing from "./Stealing";
import ScoreReview from "./ScoreReview";
import ScoreCount from './ScoreCount';

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
    let id = this.getGameId();

      Socket.emit("join", {
        name: id
      });
  
  
      Socket.emit("load_board", {
        name: id
      });

    Socket.on("render_board", resp => {

      const data = this.parsePayload(resp.payload)
      data.currentTeam = data.team_1_turn ? 'blue' : 'red';
      data.opposingTeam = data.team_1_turn ? 'red' : 'blue';
      data.backgroundColor = (data.state === "STEALING") ? data.opposingTeam : data.currentTeam;
      data.availablePoints = data.current_turn_counter - data.current_turn_correct;
      console.log('event received: \n', resp.message, '\n', data)

      this.props.updateGameData(data);
    });
  };
  
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
    console.log('id', id)
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
      case 'OVER':
        return <GameOver />
      default:
        return null;
    }
  }

  render() {

    const state = this.props.state.state;

    return (
      <div className={`game-container ${this.props.state.backgroundColor}`}>
        <Header {...this.state} />
        {(state === "STEALING" || state === "REVIEW") ? <ScoreCount/> : null }

        {this.props.state.state ? this.renderGameContent() : null}
        <Footer {...this.state} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchGameData: () => {
      dispatch(fetchGameData())
    },
    updateGameData: (gameData) => {
      const copyGameData = JSON.parse(JSON.stringify(gameData));
      dispatch(updateGameData(copyGameData))
    }
  };
};

const mapStateToProps = state => {
  return {
    state: { ...state }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);

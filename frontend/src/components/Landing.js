import React, { Component } from "react";
import $ from "jquery";
import "../Styles/App.scss";
import { connect } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { fetchGameData, toggleRules, generateID } from '../store/actions';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.input_name = React.createRef();
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  generateID = () => {
    this.props.generateID();
  };

  createGame = () => {
    this.props.fetchGameData(this.input_name.current.value);
    this.props.history.push(`/game/${this.input_name.current.value}`, {
      game_id: this.input_name.current.value
    });
  };

  toggleRules = () => {
    this.props.toggleRules();
  };

  closeModal = () => {
    if (this.props.state.areRulesOpen) {
      this.props.toggleRules();
    }
  };

  componentDidMount() {
    this.props.fetchGameData();
    this.props.generateID();
  }

  render() {
    // if (this.props.state.gameID !== "loading...") {
    return (
      <div
        className="home-container"
        id="css3-background-texture"
        onClick={this.closeModal}
      >
        <div
          className={this.props.state.areRulesOpen ? "overlay open" : "overlay closed"}
        ></div>
        <div className="gradient"></div>
        <div className="home-content flex">
          <h2 className="title">Welcome to</h2>
          <h1 className="title" id="home-title-madgab">
            MADGAB
          </h1>
          <h3 className="game-id-label">Game ID:</h3>
          {this.props.state.gameID === "loading..." ? (<h1>Loading...</h1>) :
            (<input id="game_id" aria-label="game id input field" type="text"
              className="game-id-input"
              ref={this.input_name}

              defaultValue={this.props.state.gameID}
            ></input>)}

          <button className="primary button start-game-button" aria-label="submit"
            type="submit"
            onClick={this.createGame}
            disabled={this.props.state.gameID === "loading..." ? true : false}
          >
            Start Game
          </button>
          <div id="error"></div>
        </div>
        <div
          className={
            this.props.state.areRulesOpen
              ? "rules-container open"
              : "rules-container closed"
          }
        >
          <div id="rules-button" onClick={this.toggleRules}>
            <h3>Rules</h3>
          </div>
          <p>
            These are the rules of madgab. blah blah blah blah Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Quo ut animi nesciunt,
            officia corrupti dolor alias ipsam facilis aliquid saepe fugit velit
            id ipsa eius incidunt ullam voluptates praesentium officiis.{" "}
          </p>
          <span className="close-button">x close</span>
        </div>
      </div >
    )
    // }

    // else {
    //   return (
    //     <h1>Loading</h1>
    //   )
    // }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchGameData: (gameId) => {
      dispatch(fetchGameData(gameId));
    },
    toggleRules: (areRulesOpen) => {
      dispatch(toggleRules(areRulesOpen));
    },
    generateID: () => {
      dispatch(generateID());
    }
  };
};

const mapStateToProps = state => {
  return {
    state: { ...state }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);

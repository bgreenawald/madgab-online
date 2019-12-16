import React, { Component } from "react";
import $ from "jquery";
import "../Styles/App.scss";
import { connect } from "react-redux";
// import fetchGameData from "../actions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'


import { fetchGameData, toggleRules } from '../store/actions';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game_id: "",
      used_ids: [],
      rand_id: 0,
      isRulesOpen: false
    };
    this.input_name = React.createRef();
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  generateID = () => {
    var min = 0;
    var max = 999999;
    var random = Math.floor(Math.random() * (+max - +min)) + +min;
    this.setState({
      rand_id: random
    });
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
    // console.log(this.isRulesOpen);
    if (this.props.state.areRulesOpen) {
      this.props.toggleRules();
    }
  };

  async componentDidMount() {
    await $.ajax({
      url: "http://localhost:5000/api/get_names"
    }).done(res => {
      this.generateID();

      // update store
      this.props.fetchGameData();

      this.setState({
        used_ids: res["ids"]
      });

      while (this.state.used_ids.includes(this.state.rand_id)) {
        this.generateID();
      }

      Array.from(
        document.getElementsByClassName("game-id-input")
      )[0].value = this.state.rand_id;
    });
  }

  render() {
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
          <input
            aria-label="game id input field"
            className="game-id-input"
            id="game_id"
            type="text"
            ref={this.input_name}
          ></input>
          <button
            aria-label="submit"
            type="submit"
            onClick={this.createGame}
            className="primary button start-game-button"
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
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchGameData: (gameId) => {
      dispatch(fetchGameData(gameId));
    },
    toggleRules: (areRulesOpen) => {
      dispatch(toggleRules(areRulesOpen));
    }
  };
};

const mapStateToProps = state => {
  return {
    state: { ...state }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);

import React, { Component } from "react";

import { connect } from "react-redux";
import { startTurn, toggleUserRole } from "../store/actions";

import Socket from "./Socket";
import gsap from "gsap";
import '../Styles/Waiting.scss';

class Waiting extends Component {
  constructor(props) {
    super(props);
    this.animation = gsap
      .timeline({ defaults: { duration: 1, opacity: 0 } })
      .timeScale(1.5)
      .paused(true);
  }

  componentDidMount() {
    this.animation
      .from("h3.its-your-turn", {
        x: 30,
      })
      .from(
        "h1.active-team",
        {
          y: 30,
        },
        "-=0.5"
      )
      .from(
        ".game-options.textbox",
        {
          y: 30,
        },
        "-=0.5"
      )
      .from(
        ".primary.button",
        {
          y: 30,
        },
        "-=0.5"
      )
      .from('.footer-child:first-child', {
        y: 30
      }, "-=0.5")
      .from('.footer-child:nth-child(2)', {
        y: 30
      }, "-=0.5")
      .resume();
  }

  handleStartTurn = () => {
    Socket.emit("start_turn", {
      name: this.props.state.id,
    });
  };

  setRole = () => {
    this.props.toggleUserRole();
  };

  render() {
    let currentTeam =
      this.props.state.currentTeam.charAt(0).toUpperCase() +
      this.props.state.currentTeam.slice(1);
    return (
      <div className="game-content">
        <div className="turn-container textbox">
          <h3 className="its-your-turn">It's your turn:</h3>
          <h1 className="active-team">{currentTeam} Team</h1>
        </div>

        <div className="game-options textbox">
          <input
            type="checkbox"
            name="userRole"
            value="clue giver"
            onChange={this.setRole}
            checked={this.props.state.userRole === "guesser" ? false : true}
          />
          <label htmlFor="Yes">I'm the clue reader</label>
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
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startTurn: () => dispatch(startTurn()),
    toggleUserRole: () => dispatch(toggleUserRole()),
  };
};

const mapStateToProps = (state) => {
  return {
    state: { ...state },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Waiting);

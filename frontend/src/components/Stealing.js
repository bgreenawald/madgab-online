import "../Styles/Stealing.scss";

import React, { Component } from "react";
import { connect } from "react-redux";

import { updateGameData } from "../store/actions";

import InSteal from "./InSteal";

import { gsap } from "gsap";

class Stealing extends Component {
  constructor(props) {
    super(props);
    this.myElement = null;
    this.stolenPoints = 0;
    this.stealTimerLength = 10;
    this.stealTimer = this.stealTimerLength;
    this.animation = gsap
      .timeline({
        defaults: {
          duration: 1,
          opacity: 0,
        },
      })
      .timeScale(1.2)
      .paused(true);
    this.countdownAnimation = gsap
      .timeline({
        defaults: {
          duration: 1,
        },
      })
      .paused(true);
  }

  componentDidMount() {
    this.showScore();
    this.animation
      .from("#available-points", {
        duration: 1,
        opacity: 0,
        y: 50,
        ease: "power3",
      })
      .from(
        ".line.three",
        {
          duration: 1,
          opacity: 0,
          y: 50,
          ease: "power3",
        },
        "-=.5"
      )
      .from(
        ".line.two",
        {
          duration: 1,
          opacity: 0,
          y: 50,
          ease: "power3",
        },
        "-=1"
      )
      .to(".circle-icon.correct", {
        opacity: 0,
        y: 50,
        ease: "power3",
      })
      .play();
  }

  beginSteal = () => {
    this.props.updateGameData({
      inCountdown: true,
    });
    this.hideScore();
  };

  hideScore() {
    this.props.updateGameData({
      scoreVisible: false,
    });
  }

  showScore() {
    this.props.updateGameData({
      scoreVisible: true,
    });
  }

  render() {
    if (this.props.state.inCountdown === true) {
      return <InSteal />;
    } else if (this.props.state.availablePoints >= 0) {
      return (
        <div className="game-content">
          <h1 className="line three">{this.props.state.opposingTeam} team</h1>
          <h3 className="line two">here's your chance to steal</h3>
          <div className="icon-placeholder"></div>
          <h1 id="available-points">
            {this.props.state.availablePoints} points
          </h1>
          <div className="cta-begin-stealing">
            <button className="primary" onClick={this.beginSteal}>
              Let's steal!
            </button>
            <div className="tooltip-icon tooltip">
              ?
              <div className="tooltip-modal">
                <span>these are the rules</span>
                <span className="arrow-down"></span>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="game-content">
          <div className="loading-container">
            <div className="loader"> </div>{" "}
          </div>{" "}
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    state: {
      ...state,
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateGameData: (gameData) => {
      const copyGameData = JSON.parse(JSON.stringify(gameData));
      dispatch(updateGameData(copyGameData));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stealing);

import React, { Component } from "react";

import { connect } from "react-redux";
import { updateGameData } from "../store/actions";

import { gsap } from "gsap";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { TimelineLite } from "gsap/all";

import "../Styles/GameOver.scss";
import ConfettiParticle from "./Confetti";

import Socket from "./Socket";

gsap.registerPlugin(Physics2DPlugin);

class GameOver extends Component {
  constructor(props) {
    super(props);
    this.gameover = null;
    this.button = null;
    this.state = {
      confetti: [],
    };
    this.confettiArray = new Array(80).fill().map((_, index) => {
      return <ConfettiParticle key={index} />;
    });
  }

  componentDidMount() {
    gsap.registerPlugin(Physics2DPlugin);
    this.popConfetti();
  }

  setWinnerBackground() {
      const winningTeamColor = this.props.state.winning_team.toLowerCase() === "team 1" ? "blue" : "red";
      this.props.updateGameData({
          backgroundColor: winningTeamColor
      })
  }

  popConfetti() {
    this.particles(this.confettiArray, 100, -14, 16);
  }

  createConfetti = (particlesNumber) => {
    const array = new Array(particlesNumber)
      .fill()
      .map((_, index) => <ConfettiParticle key={index} />);
    this.confettiArray = array;
  };

  particles(particleArray, x, y) {
    let colors = ["#FFFF04", "#EA4C89", "#892AB8", "#4AF2FD"];
    console.log("confetti array 2", particleArray);

    const selectedParticles = document.querySelectorAll(".confetti-particle");
    selectedParticles.forEach((dot) => {
      let angle = gsap.utils.random(0, 180);
      let velocity = gsap.utils.random(200, 300);
        let friction = gsap.utils.random(0.1, 0.15);
        console.log(friction)

      gsap
        .timeline()
        .to(dot, {
          opacity: 1,
          duration: 2.8,
          rotationX: `-=${gsap.utils.random(720, 1440)}`,
          rotationZ: `+=${gsap.utils.random(720, 1440)}`,
          physics2D: {
            angle: angle,
            velocity: velocity,
            gravity: 120,
            acceleration: 50,
            accelerationAngle: 180,

          },
        })
        .to(
          dot,
          {
            opacity: 0,
            duration: 1,
          },
          "-=1"
        );
    });
  }

  startNewGame() {
    Socket.emit("reset_game", {
        name: this.props.state.id
    })
  }
 
  getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
  }

  getRandomDouble(min, max) {
      return min + (Math.random() * (max-min));
  }

  render() {
    return (
      <div className="game-content gameover">
          <h1>
            <span role="img" aria-label="confetti-popper">
              🎉
            </span>
            {this.props.state.winning_team === 'team 1' ? "Blue" : "Red"} Team Wins!!
            <span role="img" aria-label="confetti-popper">
              🎉
            </span>
          </h1>
        {this.confettiArray}
        <button
          className="primary button"
          ref={(div) => (this.button = div)}
          onClick={() => {this.startNewGame()}}
        >
         Play Again
          {/* {this.state.confetti} */}
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    state: { ...state },
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

export default connect(mapStateToProps, mapDispatchToProps)(GameOver);

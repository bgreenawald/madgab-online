import React, { Component } from "react";

import { connect } from "react-redux";
import { updateGameData } from "../store/actions";

import { gsap } from "gsap";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";

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
    this.confettiArray = new Array(160).fill().map((_, index) => {
      return <ConfettiParticle key={index} position="left" />;
    });
    this.confettiArray2 = new Array(80).fill().map((_, index) => {
      return <ConfettiParticle key={index + 170} position="right" />;
    });
    this.animation = gsap
      .timeline({ defaults: { duration: 1, opacity: 0 } })
      .paused(true);
  }

  componentDidMount() {
    this.animation
      .from(".winning-team", {
        ease: "back",
        y: -30, 
        scale: 0,
        delay: 1
      })
      .from("button", {
          ease: "power3",
          y: -20, 
          scale: 0
      })
      .resume();
    gsap.registerPlugin(Physics2DPlugin);
    this.popConfetti();
  }

  setWinnerBackground() {
    const winningTeamColor =
      this.props.state.winning_team.toLowerCase() === "team 1" ? "blue" : "red";
    this.props.updateGameData({
      backgroundColor: winningTeamColor,
    });
  }

  createConfetti = (particlesNumber) => {
    const array = new Array(particlesNumber)
      .fill()
      .map((_, index) => <ConfettiParticle key={index} />);
    this.confettiArray = array;
  };

  popConfetti() {
    const selectedParticlesLeft = document.querySelectorAll(
      ".confetti-particle.left"
    );
    selectedParticlesLeft.forEach((dot) => {
      let x = 100 + Math.random() * 10;
      let y = -14 + Math.random() * 10;
      this.animateParticle(dot, x, y, -30, 90);
    });

    const selectedParticlesRight = document.querySelectorAll(
      ".confetti-particle.right"
    );
    selectedParticlesRight.forEach((dot) => {
      let x = 600 + Math.random() * 10;
      let y = -14 + Math.random() * 10;
      this.animateParticle(dot, x, y, 90, 200);
    });
  }

  animateParticle(dot, x, y, minAngle, maxAngle) {
    let angle = gsap.utils.random(minAngle, maxAngle);
    let velocity = gsap.utils.random(70, 140);
    let length = Math.random() * 20;
    let delay = Math.random() * 2;

    gsap
      .timeline()
      .set(dot, {
        opacity: 0,
        scale: gsap.utils.random(0.4, 0.7),
      })
      .to(dot, {
        opacity: 1,
        duration: 0.05,
        delay: delay,
      })
      .to(dot, {
        duration: 3 + Math.random(),
        rotationX: `-=${gsap.utils.random(720, 1440)}`,
        rotationZ: `+=${gsap.utils.random(720, 1440)}`,
        force3D: true,
        x: Math.cos(angle) * length,
        y: Math.sin(angle) * length,
        physics2D: {
          angle: angle,
          velocity: velocity * 1.2,
          gravity: 100,
          ease: "elastic.out(1, .5)",
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
  }

  startNewGame() {
    Socket.emit("reset_game", {
      name: this.props.state.id,
    });
  }

  getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
  }

  getRandomDouble(min, max) {
    return min + Math.random() * (max - min);
  }

  render() {
    return (
      <div className="game-content gameover">
        <h1 className="winning-team">
          {/* <span
            role="img"
            aria-label="confetti-popper"
            className="emoji tada left"
          >
            &#127881;
          </span> */}
          {this.props.state.winning_team === "team 1" ? "Blue" : "Red"} Team
          Wins!!
          {/* <span role="img" aria-label="confetti-popper" className="emoji tada">
            🎉
          </span> */}
        </h1>
        <div className="confetti-array one">{this.confettiArray}</div>
        <div className="confetti-array two">{this.confettiArray2}</div>
        <button
          className="primary button"
          ref={(div) => (this.button = div)}
          onClick={() => {
            this.startNewGame();
          }}
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

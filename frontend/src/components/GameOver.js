import React, { Component } from "react";

import { connect } from "react-redux";
import { updateGameData } from "../store/actions";

import { gsap } from "gsap";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { TimelineLite } from "gsap/all";

import "../Styles/Confetti.scss";
import ConfettiParticle from "./Confetti";

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
        return <ConfettiParticle key={index}/>
    });
  }
  
  componentDidMount() {
    gsap.registerPlugin(Physics2DPlugin);
  }

  popConfetti(elem) {
    elem.classList.add("success");
    let ref = this;
    gsap.to(elem, {
      "--icon-x": -3,
      "--icon-y": 3,
      "--z-before": 0,
      duration: 0.2,
      onComplete() {
        ref.particles(ref.confettiArray, 100, -14, 16);
        gsap.to(elem, {
          "--icon-x": 0,
          "--icon-y": 0,
          "--z-before": -6,
          duration: 1,
          ease: "elastic.out(1, .5)",
          onComplete() {
            elem.classList.remove("success");
          },
        });
      },
    });
  }

  createConfetti = (particlesNumber) => {
    const array = new Array(particlesNumber)
      .fill()
      .map((_, index) => <ConfettiParticle key={index}/>);
    this.confettiArray = array;
  };

  

  particles(particleArray, x, y) {
    let colors = ["#FFFF04", "#EA4C89", "#892AB8", "#4AF2FD"];
    console.log('confetti array 2', particleArray);

    const selectedParticles = document.querySelectorAll('.confetti-particle')
;
    selectedParticles.forEach(dot => {
        let angle = gsap.utils.random(0, 180);
        let velocity = gsap.utils.random(200, 300);
        console.log(dot._self)

    gsap.timeline().to(
        dot, {
            opacity: 1, 
            duration: 2.8,
                    rotationX: `-=${gsap.utils.random(720, 1440)}`,
                    rotationZ: `+=${gsap.utils.random(720, 1440)}`,
                    physics2D: {
                      angle: angle,
                      velocity: velocity,
                      gravity: 120,
                      acceleration: 50,
                      accelerationAngle: 180
                    },
        }
    ).to(dot, {
        opacity: 0,
        duration: 1
    }, '-=1')
    })
  }

  render() {
    return (
      <div className="game-content gameover">
        <div className="loading-container">
          <h1>
            <span role="img" aria-label="confetti-popper">
              🎉
            </span>{" "}
            XX Team Wins!!{" "}
            <span role="img" aria-label="confetti-popper">
              🎉
            </span>
          </h1>
        </div>
        {this.confettiArray}
        <button
          className="button grey confetti-button"
          ref={(div) => (this.button = div)}
          onClick={() => {
            this.popConfetti(this.button);
          }}
        >
          <div className="icon">
            <div className="cannon"></div>
            <div className="confetti">
              <svg viewBox="0 0 18 16">
                <polyline points="1 10 4 7 4 5 6 1" />
                <path d="M4,13 C5.33333333,9 7,7 9,7 C11,7 12.3340042,6 13.0020125,4" />
                <path d="M6,15 C7.83362334,13.6666667 9.83362334,12.6666667 12,12 C14.1663767,11.3333333 15.8330433,9.66666667 17,7" />
              </svg>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <div className="emitter"></div>
            </div>
          </div>
          <span>Confirm</span>
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

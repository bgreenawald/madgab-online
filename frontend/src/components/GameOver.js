import React, { ReactDOM, Component } from 'react';

import { connect } from "react-redux";
import { fetchGameData, updateGameData } from '../store/actions';

import { gsap } from "gsap";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { TweenLite, TimelineLite } from "gsap/all";

import "../Styles/Confetti.scss";

gsap.registerPlugin(Physics2DPlugin);


class GameOver extends Component {
    constructor(props) {
        super(props)
        // this.myTween = null;
        this.gameover = null;
        this.button = null;
        this.state = {
            confetti: []
        }
        this.confettiArray = [];
        this.myTween = new TimelineLite({ paused: true });
    }

    componentDidMount() {
        gsap.registerPlugin(Physics2DPlugin);
        this.myTween.staggerTo(this.confettiArray, 0.5, { y: 0, autoAlpha: 1 }, 0.1);
    }

    popConfetti(elem) {
        elem.classList.add('success');
        let ref = this;
        gsap.to(elem, {
            '--icon-x': -3,
            '--icon-y': 3,
            '--z-before': 0,
            duration: .2,
            onComplete() {
                ref.particles(elem, 100, -14, 16, -180, 180);
                gsap.to(elem, {
                    '--icon-x': 0,
                    '--icon-y': 0,
                    '--z-before': -6,
                    duration: 1,
                    ease: 'elastic.out(1, .5)',
                    onComplete() {
                        elem.classList.remove('success');
                    }
                });
            }
        });
    };

    particles(parent, quantity, x, y, minAngle, maxAngle) {
        let colors = [
            '#FFFF04',
            '#EA4C89',
            '#892AB8',
            '#4AF2FD',
        ];
        for (let i = quantity - 1; i >= 0; i--) {
            let angle = gsap.utils.random(minAngle, maxAngle),
                velocity = gsap.utils.random(70, 140),
                dot = document.createElement('div');
            dot.style.setProperty('--b', colors[Math.floor(gsap.utils.random(0, 4))]);
            // console.log('parent', parent, 'dot', dot);
            // this.confetti.push(dot);
            this.setState(prevState => ({
                confetti: [...prevState.confetti, dot]
            }))
            console.log(dot)
            gsap.set(dot, {
                opacity: 0,
                x: x,
                y: y,
                scale: gsap.utils.random(1.6, 1.7)
            });
            gsap.timeline({
                onComplete() {
                    dot.remove();
                }
            }).to(dot, {
                duration: .05,
                opacity: 1
            }, 0).to(dot, {
                duration: 1.8,
                rotationX: `-=${gsap.utils.random(720, 1440)}`,
                rotationZ: `+=${gsap.utils.random(720, 1440)}`,
                physics2D: {
                    angle: angle,
                    velocity: velocity,
                    gravity: 120
                }
            }, 0).to(dot, {
                duration: 1,
                opacity: 0
            }, .8);
        }
    }



    render() {
        return (
            <div className="game-content gameover"
            // ref={div => this.gameover = div}
            // onClick={() => { this.popConfetti(this.gameover) }}
            >
                <div className="loading-container">
                    <h1>🎉 XX Team Wins!! 🎉</h1>
                </div>
                <button className="button grey"
                    ref={div => this.button = div}
                    onClick={() => { this.popConfetti(this.button) }}
                >
                    <div className="icon">
                        <div className="cannon"></div>
                        <div className="confetti">
                            <svg viewBox="0 0 18 16">
                                <polyline points="1 10 4 7 4 5 6 1" />
                                <path d="M4,13 C5.33333333,9 7,7 9,7 C11,7 12.3340042,6 13.0020125,4" />
                                <path d="M6,15 C7.83362334,13.6666667 9.83362334,12.6666667 12,12 C14.1663767,11.3333333 15.8330433,9.66666667 17,7" />
                            </svg>
                            <i></i><i></i><i></i><i></i><i></i><i></i>
                            <div className="emitter"></div>
                        </div>
                    </div>
                    <span>Confirm</span>
                    {/* {this.state.confetti} */}
                </button>

            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        state: { ...state }
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateGameData: (gameData) => {
            const copyGameData = JSON.parse(JSON.stringify(gameData));
            dispatch(updateGameData(copyGameData));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameOver);
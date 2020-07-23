import React, { Component } from 'react';

import { connect } from "react-redux";
import { fetchGameData, updateGameData } from '../store/actions';

import {Physics2DPlugin} from 'gsap/all';


function particles(parent, quantity, x, y, minAngle, maxAngle) {
    let colors = [
        '#FFFF04',
        '#EA4C89',
        '#892AB8',
        '#4AF2FD',
    ];
    for(let i = quantity - 1; i >= 0; i--) {
        let angle = gsap.utils.random(minAngle, maxAngle),
            velocity = gsap.utils.random(70, 140),
            dot = document.createElement('div');
        dot.style.setProperty('--b', colors[Math.floor(gsap.utils.random(0, 4))]);
        parent.appendChild(dot);
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


class GameOver extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        gsap.registerPlugin(Physics2DPlugin);
        particles(document.querySelector('.game-content'), 100, -14, 16, -180, 180);
    }
    render() {
        return (
            <div className="game-content">
                <div className="loading-container">
                    <h1>🎉 XX Team Wins!! 🎉</h1>
                </div>
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
        updateGameData: gameData => {
            dispatch(updateGameData(gameData))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameOver);
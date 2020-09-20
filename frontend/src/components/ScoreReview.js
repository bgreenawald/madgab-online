import "../Styles/Game.scss";
import "../Styles/Review.scss";

import React, { Component } from "react";
import { connect } from 'react-redux';

import { updateGameData } from '../store/actions';

import Socket from './Socket';

import { gsap } from 'gsap';

let socket = Socket;

class ScoreReview extends Component {

    constructor(props) {
        super(props);
        this.cluesIcons = [];
        this.animation = gsap.timeline().timeScale(1.2);
        this.fadeAnimation = gsap.timeline().paused(true);
        this.scoreVisible = true;
    }

    componentDidMount() {
        this.animation
            .from(
                '.circle-icon:not(.total)', {
                duration: 1,
                opacity: 0,
                y: -30,
                ease: 'power4',
                stagger: 0.3
            })
            .from(
                'h1#points-count', {
                duration: 1,
                y: 30,
                ease: 'power3',
                opacity: 0,
                // onComplete: this.test
            }, '-=.7')
            .from(
                'button.primary', {
                duration: 1,
                y: 30,
                ease: 'power3',
                opacity: 0,
                // onComplete: this.test
            }, '-=.7');
            this.props.updateGameData({
                scoreVisible: this.scoreVisible
            })
    }

    fadeUp() {
        this.fadeAnimation
            .to('.game-content', {
                duration: 1,
                opacity: 0,
                y: -50,
                ease: 'power4'
            })
            .to('.circle-icon.correct', {
                duration: 1,
                opacity: 0,
                y: -50,
                ease: 'power4'
            }, '-=1').resume();
    }

    test() {
        const clueIconContainer = document.querySelector('.clue-icon-container');
        clueIconContainer.classList.add('none');
    }

    getPoints = (pts) => {
        switch (pts) {
            case 1:
                return `1 point!`;
            default:
                return `${pts} points!`
        }
    }

    stealInit = () => {
        this.fadeUp();
        setTimeout(() => {
            // this.props.updateGameData({ state: 'STEALING' });
            socket.emit("end_turn", {
                "name": this.props.state.id
            })
        }, 1000);
        console.log('steal init')
    }

    render() {
        let currentTeam = this.props.state.team_1_turn ? "Blue Team" : "Red Team";
        let totalPoints = this.getPoints(this.props.state.current_turn_correct);

        return (
            <div className="game-content">
                <h2>{currentTeam},  you scored: </h2>
                <div className="icon-placeholder"></div>
                <h1 id='points-count'>{totalPoints}</h1>
                <button className="primary" onClick={this.stealInit}>continue</button>
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
            const copyGameData = JSON.parse(JSON.stringify(gameData));
            dispatch(updateGameData(copyGameData));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreReview);
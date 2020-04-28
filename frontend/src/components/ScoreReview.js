import "../Styles/App.scss";
import "../Styles/Game.scss";

import React, { Component } from "react";
import { connect } from 'react-redux';

import Countdown from './Countdown';
import ClueIcon from './ClueIcon';
import { updateGameData } from '../store/actions';

import io from 'socket.io-client';
import { gsap } from "gsap/dist/gsap";
import { MotionPathPlugin } from "gsap/dist/MotionPathPlugin";
import { TimelineLite, CSSPlugin } from "gsap/all";

let socket = io('http://localhost:5000')

class ScoreReview extends Component {

    constructor(props) {
        super(props);
        this.myElement = null;
        this.myTween = new TimelineLite({ paused: true });
        this.cluesIcons = [];
        this.references = [];
    }
    componentDidMount = () => {
        this.props.updateGameData({
            inCountdown: true
        });
        this.myTween.staggerTo(this.cluesIcons, 0.5, { autoAlpha: 1, y: 0 }, 0.1).play();
    }

    displayAnswerResults = () => {
        let scoreArray = this.props.state.current_turn_clues;
        let index = 0;
        scoreArray.map((e, i) => (
            <ClueIcon
                key={e.id}
                value={e[2] ? 'correct' : 'incorrect'}
                ref={elem => this.cluesIcons[i] = e} />
        ))
    }

    getPoints = (pts) => {
        let currentTeam = this.props.state.team_1_turn ? "Blue Team" : "Red Team";
        let points = this.props.state.current_turn_correct;

        switch (pts) {
            case 1:
                return `1 point!`;
            default:
                return `${pts} points!`
        }
    }

    stealInit = () => {
        socket.emit("end_turn", {
            "name": this.props.state.id
        })
    }

    render() {
        let currentTeam = this.props.state.team_1_turn ? "Blue Team" : "Red Team";
        let opposingTeam = this.props.state.team_1_turn ? "Red Team" : "Blue Team";
        let totalPoints = this.getPoints(this.props.state.current_turn_correct);

        return (
            <div className="game-content">
                <h2>{currentTeam},  you scored: </h2>
                <div className="clue-icon-container">
                    {this.props.state.current_turn_clues.map((e, i) => (
                        <ClueIcon
                            value={e[2] ? 'correct' : 'incorrect'}
                            ref={ClueIcon => this.cluesIcons[i] = ClueIcon} />
                    ))}
                </div>
                <div className="square" ref={elem => this.myElement = elem}></div>
                <h1>{totalPoints}</h1>
                <button onClick={this.stealInit}>continue</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ScoreReview);
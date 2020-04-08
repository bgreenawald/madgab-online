import "../Styles/App.scss";
import "../Styles/Game.scss";

import React, { Component } from "react";
import { connect } from 'react-redux';

import Countdown from './Countdown';
import ClueIcon from './ClueIcon';
import Stealing from './Stealing';
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
        this.scoreArray = this.props.state.current_turn_clues.map(clueArray => clueArray[2]);
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
                ref={() => this.cluesIcons[i] = e} />
        ))
    }

    submitSteal = () => {
        socket.emit("steal", {
            "name": this.props.state.id,
            "points": 3
        })
    }

    getPoints = (pts) => {
        let currentTeam = this.props.state.currentTeam ? "Blue Team" : "Red Team";
        let points = this.props.state.current_turn_correct;

        switch (pts) {
            case 1:
                return `1 point!`;
            default:
                return `${pts} points!`
        }
    }

    stealOrNextTurn = () => {
        let totalScore = this.scoreArray.reduce((acc, red) => acc+red);
        let opposingTeam = this.props.state.currentTeam === "blue" ? "red" : "blue";
        totalScore = 0;
        if (totalScore === 3) {
            this.loadNextTurn(opposingTeam);
        }

        // go onto next team's turn
        else {
            // show stealing page
            // this.nextTurn()
        }
    }

    loadNextTurn = (opposingTeam) => {
      // start the next turn
      socket.emit("end_turn", {
        "name": this.props.state.id,
        "correct": this.props.state.lastGuessResult,
        "time_left": this.props.state.time_left
      })
    }

    render() {
        return (
            <div className="game-content">
                <h2>{this.props.state.currentTeam},  you scored: </h2>
                <div className="clue-icon-container">
                    {this.scoreArray.map((result, i) => (
                        <ClueIcon
                            value={result ? 'correct' : 'incorrect'}
                            ref={ClueIcon => this.cluesIcons[i] = ClueIcon} />
                    ))}
                </div>
                <div className="square" ref={elem => this.myElement = elem}></div>
                <h1>{this.getPoints(this.props.state.current_turn_correct)}</h1>
                    <button className="score__next-button" onClick={input => this.stealOrNextTurn()}>Next</button>

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
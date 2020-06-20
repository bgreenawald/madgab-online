import "../Styles/Game.scss";

import React, { Component } from "react";
import { connect } from 'react-redux';

import ClueIcon from './ClueIcon';
import { updateGameData } from '../store/actions';

import io from 'socket.io-client';

let socket = io('http://localhost:5000')

class ScoreReview extends Component {

    constructor(props) {
        super(props);
        this.cluesIcons = [];
        this.references = [];
    }
    componentDidMount = () => {
        this.props.updateGameData({
            inCountdown: true
        });
    }

    displayAnswerResults = () => {
        let scoreArray = this.props.state.current_turn_clues;
        scoreArray.map((e, i) => (
            <ClueIcon
                key={e.id}
                value={e[2] ? 'correct' : 'incorrect'}
                ref={elem => this.cluesIcons[i] = e} />
        ))
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
        socket.emit("end_turn", {
            "name": this.props.state.id
        })
    }

    render() {
        let currentTeam = this.props.state.team_1_turn ? "Blue Team" : "Red Team";
        let totalPoints = this.getPoints(this.props.state.current_turn_correct);

        return (
            <div className="game-content">
                <h2>{currentTeam},  you scored: </h2>
                <div className="clue-icon-container">
                    {this.props.state.current_turn_clues.map((e, i) => (
                        <ClueIcon
                            value={e[2] ? 'correct' : 'incorrect'}
                            ref={ClueIcon => this.cluesIcons[i] = ClueIcon}
                            key={i} />
                    ))}
                </div>
                {/* <div className="square" ref={elem => this.myElement = elem}></div> */}
                <h1>{totalPoints}</h1>
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
            dispatch(updateGameData(gameData))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreReview);
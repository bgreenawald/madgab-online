import React, { Component } from "react";
import "../Styles/App.scss";
import "../Styles/Game.scss";
import { connect } from 'react-redux';
import Countdown from './Countdown';
import ClueIcon from './ClueIcon';
import { updateGameData } from '../store/actions';
import io from 'socket.io-client';

// Sequence:
// active team scored: __/3: show animation counting correct vs. incorrect

// ---

// Inactive team, you can steal: show animation:

// Countdown get ready in 3.2.1

// countdown 10 and make enter steal before show next turn

let socket = io('http://localhost:5000')

class Stealing extends Component {
    componentDidMount = () => {
        this.props.updateGameData({
            inCountdown: true
        })
    }

    generateScoreArray = () => {

    }

    displayAnswerResults = () => {
        this.cluesIcons = [];
        this.cluesToSteal = this.props.state.current_turn_counter - this.props.state.current_turn_correct;
        let scoreArray = this.props.state.scoreArray;
        for (let result of scoreArray) {
            this.cluesIcons.push(<ClueIcon value={result} />)
        }
    }

    submitSteal = () => {
        socket.emit("steal", {
            "name": this.props.state.id,
            "points": 3
        })
    }

    countStolen = () => {

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

    render() {
        this.displayAnswerResults();
        let currentTeam = this.props.state.team_1_turn ? "Blue Team" : "Red Team";
        let opposingTeam = this.props.state.team_1_turn ? "Red Team" : "Blue Team";

        return (
            <div className="game-content">
                <h2>{currentTeam},  you scored: </h2>
                <div className="clue-icon-container">
                    {this.cluesIcons}
                </div>
                <h1>{this.getPoints(this.props.state.current_turn_correct)}</h1>
            </div>

        )
        // if (this.props.state.inCountdown) {
        //     return (<div className="game-content">
        //         <div className="stealing-container">
        //             <p>
        //                 {currentTeam} start stealing in...
        //             </p>
        //             <Countdown inheritedCountdown={[3, 2, 1]} />
        //         </div>
        //     </div>
        //     )
        // }
        // return (
        //     <div className="game-content">
        //         <div className="stealing-container">
        //             <p>{currentTeam}, you got {this.props.state.current_turn_correct}/{this.props.state.current_turn_counter} clues correct</p>
        //             <p>{opposingTeam}, here's your chance to steal {this.cluesToSteal} clues</p>
        //             {/* show score count animation */}
        //             {/* <Countdown inheritedCountdown={['10...', "Time's up!"]} /> */}
        //         </div>
        //     </div>
        // )
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

export default connect(mapStateToProps, mapDispatchToProps)(Stealing);
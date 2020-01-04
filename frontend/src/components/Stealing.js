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


// Sequence:
// active team scored: __/3: show animation counting correct vs. incorrect

// ---

// Inactive team, you can steal: show animation:

// Countdown get ready in 3.2.1

// countdown 10 and make enter steal before show next turn

let socket = io('http://localhost:5000')

class Stealing extends Component {

    constructor(props) {
        super(props);
        this.myElement = null;
        this.myTween = new TimelineLite({ paused: true });
        this.cluesIcons = [];
    }
    componentDidMount = () => {
        this.props.updateGameData({
            inCountdown: true
        });
        this.myTween = new TimelineLite({ paused: false })
            .to(this.myElement, 0.5, { y: -100, opacity: 1 })
            .play();
    }

    generateScoreArray = () => {

    }

    displayAnswerResults = () => {
        let scoreArray = this.props.state.current_turn_clues;
        for (let result of scoreArray) {
            let answer = result[2] ? 'correct' : 'incorrect';
            this.cluesIcons.push(<ClueIcon value={answer} />)
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
                <div className="square" ref={elem => this.myElement = elem}></div>
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